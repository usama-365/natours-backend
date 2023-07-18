const express = require("express");

const {
    getAllUsers,
    createUser,
    getUser,
    updateUser,
    deleteUser,
    updateCurrentUser,
    deleteCurrentUser,
    getMe
} = require("../controllers/users.controller");
const { signup, login, forgotPassword, resetPassword, updatePassword, authenticate } = require("../controllers/authentication.controller");

const router = express.Router();

router.get("/me", authenticate, getMe, getUser);

router.post("/signup", signup);
router.post("/login", login);

router.post("/forgotPassword", forgotPassword);
router.patch("/resetPassword/:token", resetPassword);

router.patch("/updatePassword", authenticate, updatePassword);

router.patch('/updateCurrentUser', authenticate, updateCurrentUser);
router.delete("/deleteCurrentUser", authenticate, deleteCurrentUser);

router.route("/")
    .get(getAllUsers)
    .post(createUser);

router.route("/:id")
    .get(getUser)
    .patch(updateUser)
    .delete(deleteUser);

module.exports = router;