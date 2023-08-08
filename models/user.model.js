const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

// name, email, photo, password, passwordConfirm
const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [ true, "Please tell us your name!" ],
	},
	email: {
		type: String,
		required: [ true, "Please provide your email!" ],
		unique: true,
		lowercase: true,
		validate: [ validator.isEmail, "Please provide a valid email" ],
	},
	photo: {
		type: String,
		default: "default.jpg",
	},
	role: {
		type: String,
		enum: [ "user", "guide", "lead-guide", "admin" ],
		default: "user",
	},
	password: {
		type: String,
		required: [ true, "Please provide a password" ],
		minlength: [ 8, "Password should be minimum 8 characters" ],
		select: false,
	},
	passwordConfirm: {
		type: String,
		required: [ true, "Please confirm your password" ],
		validate: {
			// ONLY works on CREATE and SAVE
			validator: function (el) {
				return el === this.password;
			},
			message: "Passwords are not the same",
		},
	},
	passwordChangedAt: Date,
	passwordResetToken: String,
	passwordResetExpires: Date,
	active: {
		type: Boolean,
		default: true,
		select: false,
	},
});

userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) return next();
	this.password = await bcrypt.hash(this.password, 12);
	this.passwordConfirm = undefined;
	next();
});

userSchema.pre("save", function (next) {
	// If the password isn't modified or the document is new, don't calculate
	// passwordChangedAt
	if (!this.isModified("password") || this.isNew) return next();
	this.passwordChangedAt = Date.now() - 1000; // Lagging 1 second behind so
	                                            // doesn't exceed the jwt iat
	next();
});

userSchema.pre(/^find/, function (next) {
	this.find({ active: { $ne: false } });
	next();
});

userSchema.methods.checkPassword = async function (passwordToCheck) {
	return await bcrypt.compare(passwordToCheck, this.password);
};

userSchema.methods.passwordWasChangedAfter = async function (JWTTimeStamp) {
	if (this.passwordChangedAt) {
		const passwordChangeTime = Math.round(this.passwordChangedAt.getTime() / 1000);
		return passwordChangeTime > JWTTimeStamp;
	}
	return false;
};

userSchema.methods.createPasswordResetToken = function () {
	// Create and encrypt the reset token
	const resetToken = crypto.randomBytes(32).toString("hex");
	this.passwordResetToken = crypto.createHash("sha256")
		.update(resetToken)
		.digest("hex");

	// Set the reset token to expire in 10 minutes and return the unencrypted
	// token
	this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
	return resetToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;