// backend/authMiddleware.js

const jwt = require("jsonwebtoken");

/**
 * Middleware to authenticate JWT token from Authorization header
 */
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"]; // Expect format: Bearer <token>
  const token = authHeader?.split(" ")[1]; // Extract token after 'Bearer'

  // If no token is provided, reject with 401 Unauthorized
  if (!token) {
    return res.status(401).json({ message: "Unauthorized - No token provided." });
  }

  // Verify token using the JWT_SECRET (fallback to 'secret123' if not set)
  jwt.verify(token, process.env.JWT_SECRET || "secret123", (err, user) => {
    if (err) {
      // If verification fails (e.g., expired/invalid token), respond 401
      return res.status(401).json({ message: "Unauthorized - Invalid token." });
    }

    req.user = user; // Store decoded token payload in request
    next(); // Token valid – proceed to route handler
  });
}

module.exports = authenticateToken;
