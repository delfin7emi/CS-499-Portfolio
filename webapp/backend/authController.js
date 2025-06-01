// authController.js

const express = require('express');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// File path for persistent storage
const usersFile = path.join(__dirname, 'users.json');

// Utility: Read users from file (O(1) assuming small file, or O(n) worst-case linear scan)
function loadUsers() {
    try {
        const data = fs.readFileSync(usersFile, 'utf-8');
        return JSON.parse(data);
    } catch (err) {
        return {};
    }
}

// Utility: Save users to file (O(n))
function saveUsers(users) {
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

// POST /auth/register
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    // Input validation: O(n) regex match
    const validUsername = /^[a-zA-Z0-9]{4,15}$/.test(username);
    const validPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/.test(password);
    if (!validUsername || !validPassword) {
        return res.status(400).json({ message: 'Invalid username or password format.' });
    }

    const users = loadUsers();

    if (users[username]) {
        return res.status(409).json({ message: 'Username already exists.' });
    }

    // Hash password securely: O(n) where n = hash rounds
    const hashedPassword = await bcrypt.hash(password, 10);
    users[username] = hashedPassword;

    // Save user persistently: O(n)
    saveUsers(users);

    res.status(201).json({ message: 'User registered.' });
});

// POST /auth/login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const users = loadUsers();
    const storedHash = users[username];

    // Existence check: O(1)
    if (!storedHash) {
        return res.status(400).json({ message: 'Invalid username or password.' });
    }

    // Hash comparison: O(n)
    const match = await bcrypt.compare(password, storedHash);
    if (!match) {
        return res.status(400).json({ message: 'Invalid username or password.' });
    }

    res.json({ message: 'Login successful.' });
});

module.exports = router;
