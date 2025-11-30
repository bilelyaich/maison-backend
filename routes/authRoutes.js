const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController"); 
const { isAdmin, isUser } = require("../middleware/roleMiddleware");
const verifyToken = require("../middleware/authMiddleware");


router.post("/register", authController.register);
router.post("/verify-otp", authController.verifyOtp);
router.post("/login", authController.login);
router.post("/login", authController.login);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);




module.exports = router;
