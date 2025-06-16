// ============================================
// Auth Controller
// Handles registration and login
// Enhancements:
// - Password strength check
// - Duplicate user prevention
// - JWT token generation
// - Safe file handling
// ============================================

const express = require("express");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const zxcvbn = require("zxcvbn");

const router = express.Router();

// ===============================
// CONFIGURATION
// ===============================
const DATA_DIR = path.resolve(__dirname, "../data");
const usersFile = path.join(DATA_DIR, "users.json");
const JWT_SECRET = process.env.JWT_SECRET || "secret123";

test("authController loads", () => {
  const controller = require("../authController");
  expect(controller).toBeDefined();
});


// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// ===============================
// Helpers
// ===============================
function loadUsers() {
  try {
    if (!fs.existsSync(usersFile)) return {};
    const content = fs.readFileSync(usersFile, "utf8");
    return JSON.parse(content || "{}");
  } catch (err) {
    console.error(" Error loading users.json:", err);
    return {};
  }
}

function saveUsers(users) {
  try {
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
  } catch (err) {
    console.error(" Error saving users.json:", err);
  }
}

// ===============================
// POST /auth/register
// ===============================
router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  // Validate input
  if (!username || !password || typeof username !== "string" || typeof password !== "string") {
    return res.status(400).json({ message: "Invalid input. Username and password are required." });
  }

  // Password strength
  const score = zxcvbn(password).score;
  if (password.length < 8 || score < 2) {
    return res.status(400).json({ message: "Password too weak. Use a stronger password." });
  }

  const users = loadUsers();

  if (users[username]) {
    return res.status(409).json({ message: "Username already exists." });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  users[username] = { password: hashedPassword };

  saveUsers(users);

  return res.status(201).json({ message: "User registered successfully." });
});

// ===============================
// POST /auth/login
// ===============================
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const users = loadUsers();
  const user = users[username];

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid username or password." });
  }

  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "1h" });
  return res.status(200).json({ token });
});

module.exports = router;
