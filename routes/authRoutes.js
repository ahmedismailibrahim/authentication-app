const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");

router.route("/register").post(authController.registerUser);
router.route("/login").post(authController.loginUser);
router.route("/refresh").get(authController.refreshToken);
router.route("/logout").post(authController.logoutUser);

module.exports = router;
