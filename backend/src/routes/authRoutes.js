const express = require("express");
const AuthController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/signup", AuthController.signup);
router.post("/login", AuthController.login);
router.get("/me", authMiddleware, AuthController.getMe);

module.exports = router;
