// server.js
// ===========================
// Grazioso Rescue API Backend
// Includes Dogs, Monkeys, Authentication, and Search APIs
// CS-499 Enhancement: Algorithms and Data Structures + Security
// ===========================

const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const authenticateToken = require('./authMiddleware'); // JWT middleware
const authController = require('./authController');    // /auth routes
const rateLimit = require('express-rate-limit'); //  New

const app = express();
const PORT = 3000;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
});

// ===========================
// Middleware
// ===========================
app.use(cors());                    // Enables CORS support
app.use(express.json());           // Automatically parses JSON payloads
app.use(limiter);
app.use('/auth', authController);  // Handles /auth/register and /auth/login

// ===========================
// File Paths (JSON "DB")
// ===========================
const dogsFile = path.join(__dirname, "dogs.json");
const monkeysFile = path.join(__dirname, "monkeys.json");

// ===========================
// Health Check Endpoint
// ===========================
app.get("/", (req, res) => {
  res.send("API is running. Use /auth, /dogs, /monkeys, /dogs/search, /monkeys/search");
});

// ===========================
// Dogs Endpoints (Protected)
// ===========================

// GET all dogs
app.get("/dogs", authenticateToken, (req, res) => {
  fs.readFile(dogsFile, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "Could not read dogs file." });
    try {
      const dogs = JSON.parse(data);
      res.json(dogs);
    } catch {
      res.status(500).json({ error: "Invalid JSON in dogs file." });
    }
  });
});

// POST new dog
app.post("/dogs", authenticateToken, (req, res) => {
  const newDog = req.body;
  fs.readFile(dogsFile, "utf8", (err, data) => {
    let dogs = [];
    if (!err && data) {
      try {
        dogs = JSON.parse(data);
      } catch {
        return res.status(500).json({ error: "Corrupted dogs file." });
      }
    }
    dogs.push(newDog);
    fs.writeFile(dogsFile, JSON.stringify(dogs, null, 2), (err) => {
      if (err) return res.status(500).json({ error: "Failed to save dog." });
      res.status(201).json({ message: "Dog saved", dog: newDog });
    });
  });
});

// GET dogs with query filters
app.get("/dogs/search", authenticateToken, (req, res) => {
  fs.readFile(dogsFile, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "Could not read dogs file." });
    try {
      let dogs = JSON.parse(data);
      const { name, status, reserved } = req.query;

      if (name) {
        dogs = dogs.filter(d => d.name?.toLowerCase().includes(name.toLowerCase()));
      }
      if (status) {
        dogs = dogs.filter(d => d.trainingStatus?.toLowerCase() === status.toLowerCase());
      }
      if (reserved) {
        const reservedBool = reserved.toLowerCase() === "true";
        dogs = dogs.filter(d => String(d.reserved).toLowerCase() === String(reservedBool));
      }

      res.json({ count: dogs.length, results: dogs });
    } catch {
      res.status(500).json({ error: "Invalid JSON in dogs file." });
    }
  });
});

// ===========================
// Monkeys Endpoints (Protected)
// ===========================

// GET monkeys with optional filters
app.get("/monkeys/search", authenticateToken, (req, res) => {
  fs.readFile(monkeysFile, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "Could not read monkeys file." });
    try {
      let monkeys = JSON.parse(data);
      const { name, species, reserved } = req.query;

      if (name) {
        monkeys = monkeys.filter(m => m.name?.toLowerCase().includes(name.toLowerCase()));
      }
      if (species) {
        monkeys = monkeys.filter(m => m.species?.toLowerCase() === species.toLowerCase());
      }
      if (reserved) {
        const reservedBool = reserved.toLowerCase() === "true";
        monkeys = monkeys.filter(m => String(m.reserved).toLowerCase() === String(reservedBool));
      }

      res.json({ count: monkeys.length, results: monkeys });
    } catch {
      res.status(500).json({ error: "Invalid JSON in monkeys file." });
    }
  });
});

// POST new monkey
app.post("/monkeys", authenticateToken, (req, res) => {
  const newMonkey = req.body;
  fs.readFile(monkeysFile, "utf8", (err, data) => {
    let monkeys = [];
    if (!err && data) {
      try {
        monkeys = JSON.parse(data);
      } catch {
        return res.status(500).json({ error: "Corrupted monkeys file." });
      }
    }
    monkeys.push(newMonkey);
    fs.writeFile(monkeysFile, JSON.stringify(monkeys, null, 2), (err) => {
      if (err) return res.status(500).json({ error: "Failed to save monkey." });
      res.status(201).json({ message: "Monkey saved", monkey: newMonkey });
    });
  });
});

// ===========================
// Conditional Server Launch
// Only start the server if NOT in test environment
// Required so tests can import the app without running the server twice
// ===========================
let serverInstance = null;

if (process.env.NODE_ENV !== 'test') {
  serverInstance = app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

// Export app and server instance for use in test files
module.exports = { app, server: serverInstance };
