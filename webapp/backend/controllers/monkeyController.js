// backend/controllers/monkeyController.js

const Monkey = require("../models/Monkeys");
const binarySearch = require("../utils/binarySearch");

// =============== POST /monkeys ===============
async function createMonkey(req, res) {
  try {
    const exists = await Monkey.findOne({ id: req.body.id });
    if (exists) return res.status(409).json({ error: "Duplicate monkey ID" });

    const monkey = new Monkey(req.body);
    await monkey.save();
    res.status(201).json({ message: "Monkey created", monkey });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// =============== GET /monkeys ===============
async function getAllMonkeys(req, res) {
  try {
    const { name, species, reserved, trainingStatus, tailLength } = req.query;

    const query = {};
    if (name) query.name = new RegExp(name, "i");
    if (species) query.species = species;
    if (trainingStatus) query.trainingStatus = trainingStatus;
    if (reserved !== undefined) query.reserved = reserved === "true";
    if (tailLength) query.tailLength = Number(tailLength);

    const monkeys = await Monkey.find(query);
    res.status(200).json({ count: monkeys.length, results: monkeys });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// =============== GET /monkeys/search ===============
async function searchMonkeys(req, res) {
  try {
    const { id, name, species, reserved, trainingStatus, tailLength } = req.query;
    const monkeys = await Monkey.find({});
    const sorted = monkeys.sort((a, b) => a.id.localeCompare(b.id));

    // Binary search by ID
    if (id) {
      const found = binarySearch(sorted, id);
      return found
        ? res.status(200).json({ count: 1, results: [found] })
        : res.status(404).json({ error: "Monkey not found" });
    }

    // Filters
    let filtered = sorted;
    if (name) filtered = filtered.filter((m) => m.name?.toLowerCase().includes(name.toLowerCase()));
    if (species) filtered = filtered.filter((m) => m.species === species);
    if (trainingStatus) filtered = filtered.filter((m) => m.trainingStatus === trainingStatus);
    if (reserved !== undefined) filtered = filtered.filter((m) => m.reserved === (reserved === "true"));
    if (tailLength) filtered = filtered.filter((m) => Number(m.tailLength) === Number(tailLength));

    return res.status(200).json({ count: filtered.length, results: filtered });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  createMonkey,
  getAllMonkeys,
  searchMonkeys,
};
