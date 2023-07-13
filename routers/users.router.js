const express = require("express");

const {
    getAllUsers,
    createUser,
    getUser,
    updateUser,
    deleteUser
} = require("../controllers/users.controller");
const {signup} = require("../controllers/authentication.controller");

const router = express.Router();

router.post("/signup", signup)

router.route("/")
    .get(getAllUsers)
    .post(createUser);

router.route("/:id")
    .get(getUser)
    .patch(updateUser)
    .delete(deleteUser);

module.exports = router;