const AuthService = require("../services/authService");

class AuthController {
  static async signup(req, res) {
    try {
      const { name, email, password } = req.body;

      if (!name || typeof name !== "string" || name.trim() === "") {
        return res.status(400).json({ error: "Name is required and cannot be empty" });
      }

      if (!email || typeof email !== "string" || email.trim() === "") {
        return res.status(400).json({ error: "Email is required and cannot be empty" });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        return res.status(400).json({ error: "Please provide a valid email address" });
      }

      if (!password || typeof password !== "string" || password.length < 6) {
        return res.status(400).json({ error: "Password must be at least 6 characters long" });
      }

      const newUser = await AuthService.createUser({ name, email, password });
      const token = AuthService.generateToken(newUser);

      return res.status(201).json({
        message: "User registered successfully",
        token,
        user: newUser.toSafeUser()
      });
    } catch (error) {
      if (error.statusCode === 400) {
        return res.status(400).json({ error: error.message });
      }
      console.error("Error during signup:", error);
      return res.status(500).json({ error: "Failed to create user account" });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }

      const user = await AuthService.findUserByEmail(email);
      if (!user) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      const isValidPassword = await AuthService.verifyPassword(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      const token = AuthService.generateToken(user);

      return res.status(200).json({
        message: "Login successful",
        token,
        user: user.toSafeUser()
      });
    } catch (error) {
      console.error("Error during login:", error);
      return res.status(500).json({ error: "Failed to authenticate user" });
    }
  }

  static async getMe(req, res) {
    try {
      const user = await AuthService.findUserById(req.user.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      return res.status(200).json({ user: user.toSafeUser() });
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return res.status(500).json({ error: "Failed to fetch user profile" });
    }
  }
}

module.exports = AuthController;
