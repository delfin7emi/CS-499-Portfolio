// middleware/authMiddleware.js

// Load environment variables
require("dotenv").config();

// Load JSON Web Token package
const jwt = require("jsonwebtoken");

/**
 * Middleware to authenticate JWT token from Authorization header.
 * Protects routes by ensuring valid user credentials.
 */
function authenticateToken(req, res, next) {
  // Extract 'Authorization' header (format expected: Bearer <token>)
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1]; // safely handles undefined

  // If no token is provided, reject the request
  if (!token) {
    return res.status(401).json({
      message: "Unauthorized - No token provided.",
    });
  }

  // Verify JWT token using secret from environment
  jwt.verify(token, process.env.JWT_SECRET || "secret123", (err, user) => {
    if (err) {
      return res.status(401).json({
        message: "Unauthorized - Invalid or expired token.",
      });
    }

    // Token is valid — attach decoded user to request
    req.user = user;
    next();
  });
}

// Export middleware
module.exports = authenticateToken;
