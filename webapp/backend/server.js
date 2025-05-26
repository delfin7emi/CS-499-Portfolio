// server.js
// ===========================
// Express server for Dogs and Monkeys API
// ===========================

const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware to enable CORS and parse JSON requests
app.use(cors());
app.use(express.json());

// File paths
const dogsFile = path.join(__dirname, "dogs.json");
const monkeysFile = path.join(__dirname, "monkeys.json");

// Root route (for testing if API is live)
app.get("/", (req, res) => {
  res.send("API is running. Use /dogs or /monkeys endpoints.");
});

// ===========================
// DOGS ENDPOINTS
// ===========================

// GET /dogs - return all dogs
app.get("/dogs", (req, res) => {
  fs.readFile(dogsFile, "utf8", (err, data) => {
    if (err) {
      console.error("Failed to read dogs.json:", err);
      return res.status(500).json({ error: "Failed to read dogs file." });
    }
    try {
      const dogs = JSON.parse(data);
      res.json(dogs);
    } catch (parseErr) {
      res.status(500).json({ error: "Invalid JSON format in dogs file." });
    }
  });
});

// POST /dogs - add new dog
app.post("/dogs", (req, res) => {
  const newDog = req.body;
  fs.readFile(dogsFile, "utf8", (err, data) => {
    let dogs = [];
    if (!err && data) {
      try {
        dogs = JSON.parse(data);
      } catch (parseErr) {
        return res.status(500).json({ error: "Invalid JSON in dogs file." });
      }
    }
    dogs.push(newDog);
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

// GET /monkeys - return all monkeys
app.get("/monkeys", (req, res) => {
  fs.readFile(monkeysFile, "utf8", (err, data) => {
    if (err) {
      console.error("Failed to read monkeys.json:", err);
      return res.status(500).json({ error: "Failed to read monkeys file." });
    }
    try {
      const monkeys = JSON.parse(data);
      res.json(monkeys);
    } catch (parseErr) {
      res.status(500).json({ error: "Invalid JSON format in monkeys file." });
    }
  });
});

// POST /monkeys - add new monkey
app.post("/monkeys", (req, res) => {
  const newMonkey = req.body;
  fs.readFile(monkeysFile, "utf8", (err, data) => {
    let monkeys = [];
    if (!err && data) {
      try {
        monkeys = JSON.parse(data);
      } catch (parseErr) {
        return res.status(500).json({ error: "Invalid JSON in monkeys file." });
      }
    }
    monkeys.push(newMonkey);
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
