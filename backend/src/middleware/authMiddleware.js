const AuthService = require("../services/authService");

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Access denied. Authentication token is missing" });
  }

  const token = authHeader.split(" ")[1];
  const decoded = AuthService.verifyToken(token);

  if (!decoded) {
    return res.status(401).json({ error: "Invalid or expired authentication token" });
  }

  req.user = decoded;
  next();
}

module.exports = authMiddleware;
