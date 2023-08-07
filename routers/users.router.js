const express = require("express");

const {
	getAllUsers,
	createUser,
	getUser,
	updateUser,
	deleteUser,
	updateCurrentUser,
	deleteCurrentUser,
	getMe,
} = require("../controllers/users.controller");
const {
	signup,
	login,
	forgotPassword,
	resetPassword,
	updatePassword,
	authenticate,
	authorizeTo,
	logout,
} = require("../controllers/authentication.controller");

const router = express.Router();

// Routes for unauthenticated users
router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", logout);
router.post("/forgotPassword", forgotPassword);
router.patch("/resetPassword/:token", resetPassword);

// Routes for authenticated routes
router.use(authenticate);
router.get("/me", getMe, getUser);
router.patch("/updateMyPassword", updatePassword);
router.patch("/updateMe", updateCurrentUser);
router.delete("/deleteMe", deleteCurrentUser);

// REST endpoints for admin
router.use(authorizeTo("admin"));
router.route("/")
	.get(getAllUsers)
	.post(createUser);
router.route("/:id")
	.get(getUser)
	.patch(updateUser)
	.delete(deleteUser);

module.exports = router;