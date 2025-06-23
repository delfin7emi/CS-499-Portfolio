// ============================
// routes/dogRoutes.js
// ============================

const express = require("express");
const router = express.Router();

const authenticateToken = require("../middleware/authMiddleware");
const validateDog = require("../middleware/validateDog");
const dogController = require("../controllers/dogController");

// Create new dog
router.post("/", authenticateToken, validateDog, dogController.createDog);

// Get dogs (filter by query)
router.get("/", authenticateToken, dogController.getDogs);

// Search dog by ID or other filters
router.get("/search", authenticateToken, dogController.searchDogs);

module.exports = router;


// ============================
// controllers/dogController.js
// ============================

const Dog = require("../models/Dogs");
const binarySearch = require("../utils/binarySearch");

// Create new dog
exports.createDog = async (req, res) => {
  try {
    const exists = await Dog.findOne({ id: req.body.id });
    if (exists) return res.status(409).json({ error: "Duplicate dog ID" });

    const dog = new Dog(req.body);
    await dog.save();
    res.status(201).json({ message: "Dog created", dog });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get dogs with optional filters
exports.getDogs = async (req, res) => {
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
};

// Search dogs using binary search or filters
exports.searchDogs = async (req, res) => {
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
};
