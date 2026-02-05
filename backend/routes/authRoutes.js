const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");

/* diffrent : 
    router.post() : Only one HTTP method is needed
    router.route().post().get().delete() :is used when we want to group multiple HTTP methods for the same route,
       
    There is NO functional difference in how Express handles the request both Have the same performance
    The difference is code organization & readability, not behavior.
*/ 

router.route("/register").post(authController.registerUser);
router.route("/login").post(authController.loginUser);
router.route("/refresh").get(authController.refreshToken);
router.route("/logout").post(authController.logoutUser);

module.exports = router;
