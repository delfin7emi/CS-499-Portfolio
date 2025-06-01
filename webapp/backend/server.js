// server.js
// ===========================
// Express server for Grazioso Rescue Animal System
// Includes Dogs, Monkeys, and Authentication API
// CS-499 Enhancement: Algorithms and Data Structures
// ===========================

const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

// Auth controller for login system enhancement (username/password + Big O logic)
const authController = require('./authController'); 

const app = express();
const PORT = 3000;

// Middleware
app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Parse incoming JSON

// Register authentication routes
app.use('/auth', authController); // Enhancement: Security + Big O validated logic

// File paths for persistence
const dogsFile = path.join(__dirname, "dogs.json");
const monkeysFile = path.join(__dirname, "monkeys.json");

// ===========================
// Root route (Basic API health check)
// ===========================
app.get("/", (req, res) => {
  res.send("API is running. Use /dogs, /monkeys, or /auth endpoints.");
});

// ===========================
// DOGS ENDPOINTS
// ===========================

// GET /dogs - Returns all dogs, with optional query filters
app.get("/dogs", (req, res) => {
  fs.readFile(dogsFile, "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Failed to read dogs file." });
    }
    try {
      let dogs = JSON.parse(data); // O(n)

      // Optional query filters: O(n)
      const { name, status } = req.query;

      if (name) {
        dogs = dogs.filter(dog => dog.name.toLowerCase().includes(name.toLowerCase())); // O(n)
      }

      if (status) {
        dogs = dogs.filter(dog => dog.status.toLowerCase() === status.toLowerCase()); // O(n)
      }

      res.json(dogs);
    } catch {
      res.status(500).json({ error: "Invalid JSON in dogs file." });
    }
  });
});


// POST /dogs - Add a new dog
app.post("/dogs", (req, res) => {
  const newDog = req.body;

  // Read-modify-write: O(n) for read and write combined
  fs.readFile(dogsFile, "utf8", (err, data) => {
    let dogs = [];
    if (!err && data) {
      try {
        dogs = JSON.parse(data); // O(n)
      } catch (parseErr) {
        return res.status(500).json({ error: "Invalid JSON in dogs file." });
      }
    }

    dogs.push(newDog); // O(1)
    fs.writeFile(dogsFile, JSON.stringify(dogs, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: "Could not save dog data." });
      }
      res.status(201).json({ message: "Dog saved", dog: newDog });
    });
  });
});

// ===========================
// MONKEYS ENDPOINTS
// ===========================

// GET /monkeys - Returns all monkeys, with optional query filters
app.get("/monkeys", (req, res) => {
  fs.readFile(monkeysFile, "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Failed to read monkeys file." });
    }
    try {
      let monkeys = JSON.parse(data); // O(n)

      const { name, species } = req.query;

      if (name) {
        monkeys = monkeys.filter(monkey => monkey.name.toLowerCase().includes(name.toLowerCase())); // O(n)
      }

      if (species) {
        monkeys = monkeys.filter(monkey => monkey.species.toLowerCase() === species.toLowerCase()); // O(n)
      }

      res.json(monkeys);
    } catch {
      res.status(500).json({ error: "Invalid JSON in monkeys file." });
    }
  });
});


// POST /monkeys - Add a new monkey
app.post("/monkeys", (req, res) => {
  const newMonkey = req.body;

  fs.readFile(monkeysFile, "utf8", (err, data) => {
    let monkeys = [];
    if (!err && data) {
      try {
        monkeys = JSON.parse(data); // O(n)
      } catch (parseErr) {
        return res.status(500).json({ error: "Invalid JSON in monkeys file." });
      }
    }

    monkeys.push(newMonkey); // O(1)
    fs.writeFile(monkeysFile, JSON.stringify(monkeys, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: "Could not save monkey data." });
      }
      res.status(201).json({ message: "Monkey saved", monkey: newMonkey });
    });
  });
});

// ===========================
// Start server
// ===========================
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
