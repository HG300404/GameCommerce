const express = require("express");
const router = express.Router();
const userController = require("../controllers/UserController");
router.post("/sign-up", userController.createUser);
router.post("/sign-in", userController.loginUser);
router.post("/log-out", userController.logoutUser);
router.post("/refresh-token", userController.refreshToken);
module.exports = router;
