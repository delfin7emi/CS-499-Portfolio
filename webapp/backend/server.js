// server.js
// ============================================
// Grazioso Rescue API Backend
// Includes Dogs, Monkeys, Authentication, and Search APIs
// Enhancement: Algorithms & Data Structures (Binary Search)
// Enhancement: Security (Rate Limiting, Token Auth)
// ============================================

const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const rateLimit = require("express-rate-limit");
const authController = require("./authController"); // Handles /auth/register and /auth/login
const authenticateToken = require("./authMiddleware"); // Middleware to protect endpoints
const binarySearch = require(path.join(__dirname, "utils", "binarySearch")); // Enhanced binary search utility

const app = express();
const PORT = 3000;

// ============================================
// Middleware Setup
// ============================================
app.use(cors()); // Allow CORS
app.use(express.json()); // Parse JSON bodies

// Apply rate limiting: 100 requests per 15 minutes per IP
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests from this IP, please try again later.",
  })
);

// Authentication endpoints
app.use("/auth", authController);

// ============================================
// File paths to JSON data (mock database files)
// ============================================
const dogsFile = path.join(__dirname, "dogs.json");
const monkeysFile = path.join(__dirname, "monkeys.json");

// ============================================
// Health Check Route
// ============================================
app.get("/", (req, res) => {
  res.send("API is running. Use /auth, /dogs, /monkeys, /dogs/search, /monkeys/search");
});

// ============================================
// GET all dogs (Protected)
// ============================================
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

// ============================================
// POST new dog (Protected)
// ============================================
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

// ============================================
// GET dogs with filters (Enhanced: Binary Search by ID + Fallbacks)
// ============================================
app.get("/dogs/search", authenticateToken, (req, res) => {
  fs.readFile(dogsFile, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "Could not read dogs file." });

    try {
      let dogs = JSON.parse(data);
      const { id, name, status, reserved } = req.query;

      // Binary search on sorted array
      if (id) {
        dogs.sort((a, b) => a.id.localeCompare(b.id)); // Ensure sorted by ID
        const found = binarySearch(dogs, id);

        if (found) {
          return res.status(200).json({ count: 1, results: [found] });
        } else {
          return res.status(404).json({ error: "Dog not found with given ID." });
        }
      }


      // Fallback filters
      if (name) {
        dogs = dogs.filter((d) => d.name?.toLowerCase().includes(name.toLowerCase()));
      }
      if (status) {
        dogs = dogs.filter((d) => d.trainingStatus?.toLowerCase() === status.toLowerCase());
      }
      if (reserved) {
        const reservedBool = reserved.toLowerCase() === "true";
        dogs = dogs.filter((d) => String(d.reserved).toLowerCase() === String(reservedBool));
      }

      res.status(200).json({ count: dogs.length, results: dogs });
    } catch {
      res.status(500).json({ error: "Invalid JSON in dogs file." });
    }
  });
});

// ============================================
// GET monkeys with filters (Enhanced: Binary Search by ID + Fallbacks)
// ============================================
app.get("/monkeys/search", authenticateToken, (req, res) => {
  fs.readFile(monkeysFile, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "Could not read monkeys file." });

    try {
      let monkeys = JSON.parse(data);
      const { id, name, species, reserved } = req.query;

      if (id) {
        monkeys.sort((a, b) => a.id.localeCompare(b.id));
        const found = binarySearch(monkeys, id);

        if (found) {
          return res.status(200).json({ count: 1, results: [found] });
        } else {
          return res.status(404).json({ error: "Monkey not found with given ID." });
        }
      }


      // Fallbacks
      if (name) {
        monkeys = monkeys.filter((m) => m.name?.toLowerCase().includes(name.toLowerCase()));
      }
      if (species) {
        monkeys = monkeys.filter((m) => m.species?.toLowerCase() === species.toLowerCase());
      }
      if (reserved) {
        const reservedBool = reserved.toLowerCase() === "true";
        monkeys = monkeys.filter((m) => String(m.reserved).toLowerCase() === String(reservedBool));
      }

      res.status(200).json({ count: monkeys.length, results: monkeys });
    } catch {
      res.status(500).json({ error: "Invalid JSON in monkeys file." });
    }
  });
});

// ============================================
// POST new monkey (Protected)
// ============================================
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

// ============================================
// Server Launch Control (Skip if in test mode)
// ============================================
let serverInstance = null;

if (process.env.NODE_ENV !== "test") {
  serverInstance = app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

// ============================================
// Export app and instance for testing purposes
// ============================================
module.exports = { app, server: serverInstance };
