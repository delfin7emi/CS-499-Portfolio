// ============================================
// Grazioso Rescue API Backend
// Enhancements:
//   - Modular middleware/controllers
//   - MongoDB with Mongoose
//   - Secure JWT authentication
//   - Binary Search ID lookup
//   - Express Rate Limiting & Logging
// ============================================

require("dotenv").config();
require("module-alias/register");

const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const cors = require("cors");

// Load environment variables
dotenv.config();

// ==================== Import Middleware and Utils ====================
const authenticateToken = require("@middleware/authMiddleware"); // Ensure correct alias is used
const validateDog = require("@middleware/validateDog");
const validateMonkey = require("@middleware/validateMonkey");
const binarySearch = require("@utils/binarySearch"); // Ensure the path is correct
const authController = require("@controllers/authController");

// ==================== Import Mongoose Models ====================
const Dog = require("@models/Dogs");
const Monkey = require("@models/Monkeys");

// ==================== App Initialization ====================
const app = express();
const PORT = process.env.PORT || 3000;
const dbName = process.env.NODE_ENV === "test" ? "grazioso_test" : "grazioso";

// ==================== Connect to MongoDB ====================
mongoose.connect(`mongodb://127.0.0.1:27017/${dbName}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log(`MongoDB connected to ${dbName}`))
  .catch((err) => console.error("MongoDB connection error:", err));

// ==================== Middleware Setup ====================
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests, please try again later.",
}));

// ==================== Routes ====================

// Auth Routes
app.use("/auth", authController);

// Health Check
app.get("/", (req, res) => {
  res.send("Grazioso Rescue API is running. Endpoints: /auth, /dogs, /monkeys");
});

// ---------------- DOG ROUTES ----------------

// POST /dogs - Add new dog
app.post("/dogs", authenticateToken, validateDog, async (req, res) => {
  try {
    const exists = await Dog.findOne({ id: req.body.id });
    if (exists) return res.status(409).json({ error: "Duplicate dog ID" });

    const dog = new Dog(req.body);
    await dog.save();
    res.status(201).json({ message: "Dog created", dog });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /dogs - Retrieve dogs with query filters
app.get("/dogs", authenticateToken, async (req, res) => {
  try {
    const query = {};
    if (req.query.name) query.name = new RegExp(req.query.name, "i");
    if (req.query.trainingStatus) query.trainingStatus = req.query.trainingStatus;
    if (req.query.reserved) query.reserved = req.query.reserved === "true";

    const dogs = await Dog.find(query);
    res.status(200).json({ count: dogs.length, results: dogs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /dogs/search?id=D123 - Search dog by ID using binary search
app.get("/dogs/search", authenticateToken, async (req, res) => {
  try {
    const { id, name, trainingStatus, reserved } = req.query;
    const dogs = await Dog.find({});
    const sorted = dogs.sort((a, b) => a.id.localeCompare(b.id));

    if (id) {
      const found = binarySearch(sorted, id);
      return found
        ? res.status(200).json({ count: 1, results: [found] })
        : res.status(404).json({ error: "Dog not found" });
    }

    let filtered = sorted;
    if (name) filtered = filtered.filter(d => d.name.toLowerCase().includes(name.toLowerCase()));
    if (trainingStatus) filtered = filtered.filter(d => d.trainingStatus === trainingStatus);
    if (reserved) filtered = filtered.filter(d => d.reserved === (reserved === "true"));

    res.status(200).json({ count: filtered.length, results: filtered });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------- MONKEY ROUTES ----------------

// POST /monkeys - Add new monkey
app.post("/monkeys", authenticateToken, validateMonkey, async (req, res) => {
  try {
    const exists = await Monkey.findOne({ id: req.body.id });
    if (exists) return res.status(409).json({ error: "Duplicate monkey ID" });

    const monkey = new Monkey(req.body);
    await monkey.save();
    res.status(201).json({ message: "Monkey created", monkey });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /monkeys - Retrieve monkeys with query filters
app.get("/monkeys", authenticateToken, async (req, res) => {
  try {
    const query = {};
    if (req.query.name) query.name = new RegExp(req.query.name, "i");
    if (req.query.species) query.species = req.query.species;
    if (req.query.reserved) query.reserved = req.query.reserved === "true";

    const monkeys = await Monkey.find(query);
    res.status(200).json({ count: monkeys.length, results: monkeys });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /monkeys/search?id=M123 - Search monkey by ID using binary search
app.get("/monkeys/search", authenticateToken, async (req, res) => {
  try {
    const { id, name, species, reserved } = req.query;
    const monkeys = await Monkey.find({});
    const sorted = monkeys.sort((a, b) => a.id.localeCompare(b.id));

    if (id) {
      const found = binarySearch(sorted, id);
      return found
        ? res.status(200).json({ count: 1, results: [found] })
        : res.status(404).json({ error: "Monkey not found" });
    }

    let filtered = sorted;
    if (name) filtered = filtered.filter(m => m.name.toLowerCase().includes(name.toLowerCase()));
    if (species) filtered = filtered.filter(m => m.species === species);
    if (reserved) filtered = filtered.filter(m => m.reserved === (reserved === "true"));

    res.status(200).json({ count: filtered.length, results: filtered });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== Server Start (Skip if testing) ====================
let serverInstance = null;
if (process.env.NODE_ENV !== "test") {
  serverInstance = app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}

module.exports = { app, server: serverInstance };
