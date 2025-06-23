const mongoose = require("mongoose");

// ✅ Define the Monkey schema
const monkeySchema = new mongoose.Schema(
  {
    // 🔐 Unique identifier
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    // 🐒 Monkey name
    name: {
      type: String,
      required: true,
      trim: true,
    },

    // 🧬 Species (stored lowercase)
    species: {
      type: String,
      required: true,
      lowercase: true, // ✅ Normalize input
      enum: [
        "capuchin",
        "guenon",
        "macaque",
        "marmoset",
        "squirrel monkey",
        "tamarin",
      ],
    },

    // 🦴 Tail length (cm)
    tailLength: {
      type: Number,
      required: true,
      min: 0,
    },

    // 📏 Height (cm)
    height: {
      type: Number,
      required: true,
      min: 0,
    },

    // 🧍 Body length (cm)
    bodyLength: {
      type: Number,
      required: true,
      min: 0,
    },

    // ⚥ Gender (stored lowercase)
    gender: {
      type: String,
      required: true,
      lowercase: true, // ✅ Normalize input
      enum: ["male", "female"],
    },

    // 🎂 Age (years)
    age: {
      type: Number,
      required: true,
      min: 0,
    },

    // ⚖️ Weight (kg)
    weight: {
      type: Number,
      required: true,
      min: 0,
    },

    // 🗓️ Date acquired
    acquisitionDate: {
      type: Date,
      required: true,
    },

    // 🌍 Location where monkey was acquired
    acquisitionLocation: {
      type: String,
      required: true,
      trim: true,
    },

    // 🧠 Training level (stored lowercase)
    trainingStatus: {
      type: String,
      required: true,
      lowercase: true, // ✅ Normalize input
      enum: ["intensive", "basic", "none"],
    },

    // ✅ Reservation status
    reserved: {
      type: Boolean,
      required: true,
      default: false,
    },

    // 🌐 Assigned service country
    inServiceCountry: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true, // ✅ Automatically adds createdAt and updatedAt
  }
);

// ✅ Export the Monkey model
module.exports = mongoose.model("Monkey", monkeySchema);
