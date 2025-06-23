// authController.js
// =======================================
// Handles user registration and login securely
// =======================================

require('dotenv-flow').config(); // Load environment variables

const express = require('express');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const zxcvbn = require('zxcvbn'); // Password strength checking

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;
const usersFile = path.join(__dirname, 'users.json');

// Load user data
function loadUsers() {
  try {
    const data = fs.readFileSync(usersFile, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return {};
  }
}

// Save user data
function saveUsers(users) {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

// ===========================
// POST /auth/register
// ===========================
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  const validUsername = /^[a-zA-Z0-9]{4,15}$/.test(username);
  const validPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/.test(password);

  if (!validUsername || !validPassword) {
    return res.status(400).json({
      message: 'Invalid username or password format.'
    });
  }

  // Check password strength
  const strength = zxcvbn(password);
  if (strength.score < 2) {
    return res.status(400).json({
      message: 'Password is too weak. Try adding more characters, numbers, or symbols.'
    });
  }

  const users = loadUsers();

  if (users[username]) {
    return res.status(409).json({ message: 'Username already exists.' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  users[username] = hashedPassword;

  saveUsers(users);

  return res.status(201).json({ message: 'User registered successfully.' });
});

// ===========================
// POST /auth/login
// ===========================
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const users = loadUsers();
  const storedHash = users[username];

  if (!storedHash) {
    return res.status(400).json({ message: 'Invalid username or password.' });
  }

  const match = await bcrypt.compare(password, storedHash);
  if (!match) {
    return res.status(400).json({ message: 'Invalid username or password.' });
  }

  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });

  return res.status(200).json({
    message: 'Login successful.',
    token
  });
});

module.exports = router;
