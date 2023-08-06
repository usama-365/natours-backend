const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const User = require("../models/user.model");
const handleAsyncError = require("../utils/handleAsyncError.util");
const AppError = require("../utils/appError.util");
const sendEmail = require("../utils/email.util");

const signToken = id => jwt.sign({ id }, process.env.JWT_SECRET, {
	expiresIn: process.env.JWT_EXPIRES_IN,
});

const createAndSendJWTToken = (user, statusCode, res) => {
	const token = signToken(user._id);

	// Add HTTP only cookie
	res.cookie("jwt", token, {
		expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
	});

	// Remove the password hash and send response
	user.password = undefined;
	res.status(statusCode).json({
		status: "success",
		data: {
			token,
			user,
		},
	});
};

exports.signup = handleAsyncError(async (req, res, next) => {
	const {
		name,
		email,
		password,
		passwordConfirm,
		role,
	} = req.body;
	const user = await User.create({
		name,
		email,
		password,
		passwordConfirm,
		role,
	});

	return createAndSendJWTToken(user, 201, res);
});

exports.login = handleAsyncError(async (req, res, next) => {
	const {
		email,
		password,
	} = req.body;

	// Check if email and password exist
	if (!email || !password) {
		return next(new AppError(400, "Please provide email and password"));
	}

	// Check if user exists and password is correct
	const user = await User.findOne({ email }).select("+password");
	if (!user || !await user.checkPassword(password)) {
		return next(new AppError(401, "Incorrect email or password"));
	}

	// If everything is ok, send token to client
	return createAndSendJWTToken(user, 200, res);
});

exports.authenticate = handleAsyncError(async (req, res, next) => {
	// Extracting jwt token
	const { authorization } = req.headers;
	let token;
	if (authorization && authorization.startsWith("Bearer")) {
		token = authorization.split(" ")[1];
	} else if (req.cookies.jwt) {
		token = req.cookies.jwt;
	}

	// If the token doesn't exists, report error
	if (!token) {
		return next(new AppError(401, `Unauthorized. Add Authorization header in request with value 'Bearer $TOKEN'.`));
	}

	// Verify the token
	const {
		id,
		iat,
	} = jwt.verify(token, process.env.JWT_SECRET);

	// Checking if the user pointed by the token still exists
	const user = await User.findById(id);
	if (!user) return next(new AppError(401, "The user belonging to this token does no longer exist."));

	// Checking that the password wasn't changed after the token was issued
	if (await user.passwordWasChangedAfter(iat)) return next(new AppError(401, "User has recently changed password. Please login again."));

	// Everything checks out so adding user to request and forwarding
	req.user = user;
	next();
});

exports.authorizeTo = (...roles) => (req, res, next) => {
	if (!roles.includes(req.user.role)) {
		return next(new AppError(403, `This operation is only permitted to ${roles.join(", ")}.`));
	}
	next();
};

exports.forgotPassword = handleAsyncError(async (req, res, next) => {
	// Get user based on posted email
	const user = await User.findOne({ email: req.body.email });
	if (!user) return next(new AppError(404, "No user with this email address."));

	// Generate the random reset token
	const resetToken = user.createPasswordResetToken();
	await user.save({ validateBeforeSave: false });

	// Create the email message using the reset token
	const resetURL = `${req.protocol}://${req.get("host")}/api/v1/users/resetPassword/${resetToken}`;
	const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forgot your password, please ignore this email`;

	// Send the email
	try {
		await sendEmail({
			to: user.email,
			subject: "Your password reset token (valid for 10 mins)",
			message,
		});
	} catch (error) {
		// Incase of error, invalidate the token and send back error
		user.passwordResetToken = user.passwordResetExpires = undefined;
		await user.save({ validateBeforeSave: false });
		return next(new AppError(500, "There was an error sending the email. Please try again later."));
	}

	// Return success message
	res.status(200).json({
		status: "success",
		data: {
			message: "Password reset token sent to your email address",
		},
	});
});

exports.resetPassword = handleAsyncError(async (req, res, next) => {
	// Get user based on token and expiration date
	const encryptedToken = crypto.createHash("sha256")
		.update(req.params.token)
		.digest("hex");
	const user = await User.findOne({
		passwordResetToken: encryptedToken,
		passwordResetExpires: { $gt: Date.now() },
	});
	// If the token has not expired and the user is valid, update the password
	if (!user) return next(new AppError(400, "Password reset token is invalid or has expired."));
	user.password = req.body.password;
	user.passwordConfirm = req.body.passwordConfirm;
	user.passwordResetToken = user.passwordResetExpires = undefined;
	await user.save();
	// Log the user in
	return createAndSendJWTToken(user, 201, res);
});

exports.updatePassword = handleAsyncError(async (req, res, next) => {
	// Validate the POSTed parameters
	const {
		currentPassword,
		password,
		passwordConfirm,
	} = req.body;
	if (!currentPassword || !password || !passwordConfirm) return next(new AppError(400, "Please provide currentPassword, password, passwordConfirm."));

	// Check the old password
	const user = await User.findById(req.user._id).select("+password");
	if (!await user.checkPassword(currentPassword)) {
		return next(new AppError(401, "Invalid old password"));
	}

	// Update the new password
	user.password = password;
	user.passwordConfirm = passwordConfirm;
	await user.save();

	// Login the user with new credentials
	return createAndSendJWTToken(user, 200, res);
});