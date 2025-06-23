// routes/dogRoutes.js

const express = require("express");
const router = express.Router();
const Dog = require("../models/Dogs");
const authenticateToken = require("../middleware/authMiddleware");
const validateDog = require("../middleware/validateDog");

// ----------------------------------
// 🔍 Binary Search Utility Function
// ----------------------------------
function binarySearch(dogs, targetId) {
  let left = 0;
  let right = dogs.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const midId = dogs[mid].id;

    if (midId === targetId) return dogs[mid];
    if (midId < targetId) left = mid + 1;
    else right = mid - 1;
  }

  return null;
}

// --------------------------------------------------------
// ✅ GET /dogs/search — Search dogs by ID or filters
// --------------------------------------------------------
router.get("/search", authenticateToken, async (req, res) => {
  try {
    const {
      id,
      name,
      breed,
      age,
      weight,
      trainingStatus,
      reserved,
      inServiceCountry,
    } = req.query;

    let dogs = await Dog.find().lean();

    // 🔎 1. Search by ID using binary search
    if (id) {
      dogs.sort((a, b) => a.id.localeCompare(b.id));
      const found = binarySearch(dogs, id);
      if (!found) {
        return res.status(404).json({ error: `Dog with ID '${id}' not found.` });
      }
      return res.status(200).json({ count: 1, results: [found] });
    }

    // 🔎 2. Apply filters if no ID
    if (name) {
      dogs = dogs.filter((d) =>
        d.name?.toLowerCase().includes(name.toLowerCase())
      );
    }
    if (breed) {
      dogs = dogs.filter((d) =>
        d.breed?.toLowerCase() === breed.toLowerCase()
      );
    }
    if (age) {
      dogs = dogs.filter((d) => d.age === parseInt(age));
    }
    if (weight) {
      dogs = dogs.filter((d) => d.weight === parseInt(weight));
    }
    if (trainingStatus) {
      dogs = dogs.filter((d) =>
        d.trainingStatus?.toLowerCase() === trainingStatus.toLowerCase()
      );
    }
    if (reserved !== undefined) {
      const reservedBool = reserved === "true";
      dogs = dogs.filter((d) => d.reserved === reservedBool);
    }
    if (inServiceCountry) {
      dogs = dogs.filter((d) =>
        d.inServiceCountry?.toLowerCase() === inServiceCountry.toLowerCase()
      );
    }

    return res.status(200).json({ count: dogs.length, results: dogs });
  } catch (err) {
    console.error("❌ GET /dogs/search error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// --------------------------------------------------------
// ✅ POST /dogs — Add new dog with validation + token
// --------------------------------------------------------
router.post("/", authenticateToken, validateDog, async (req, res) => {
  try {
    const { id } = req.body;

    // 🔁 Check for duplicate ID
    const existing = await Dog.findOne({ id });
    if (existing) {
      return res.status(400).json({ error: "Duplicate dog ID" });
    }

    const dog = new Dog(req.body);
    await dog.save();

    return res.status(201).json({ message: "Dog created", dog });
  } catch (err) {
    console.error("❌ POST /dogs error:", err);
    return res.status(500).json({ error: "Failed to create dog" });
  }
});

// --------------------------------------------------------
// ✅ GET /dogs — List all dogs
// --------------------------------------------------------
router.get("/", authenticateToken, async (req, res) => {
  try {
    const dogs = await Dog.find().lean();
    return res.status(200).json({ count: dogs.length, results: dogs });
  } catch (err) {
    console.error("❌ GET /dogs error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// --------------------------------------------------------
// ✅ DELETE /dogs/:id — Delete dog by ID
// --------------------------------------------------------
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Dog.findOneAndDelete({ id });

    if (!deleted) {
      return res.status(404).json({ error: "Dog not found" });
    }

    return res.status(200).json({ message: "Dog deleted", dog: deleted });
  } catch (err) {
    console.error("❌ DELETE /dogs/:id error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// --------------------------------------------------------
// ✅ PUT /dogs/:id — Update dog by ID
// --------------------------------------------------------
router.put("/:id", authenticateToken, validateDog, async (req, res) => {
  try {
    const { id } = req.params;
    const updatedDog = await Dog.findOneAndUpdate({ id }, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedDog) {
      return res.status(404).json({ error: "Dog not found" });
    }

    return res.status(200).json({ message: "Dog updated", dog: updatedDog });
  } catch (err) {
    console.error("❌ PUT /dogs/:id error:", err);
    return res.status(500).json({ error: "Failed to update dog" });
  }
});

module.exports = router;
