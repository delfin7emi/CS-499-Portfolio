// models/Dogs.js

const mongoose = require("mongoose");

// ✅ Define schema for Dog with full validation
const dogSchema = new mongoose.Schema({
  id: {
    type: String,
    required: [true, "Dog ID is required"],
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true
  },
  breed: {
    type: String,
    required: [true, "Breed is required"],
    trim: true
  },
  age: {
    type: Number,
    required: [true, "Age is required"],
    min: [0, "Age cannot be negative"]
  },
  weight: {
    type: Number,
    required: [true, "Weight is required"],
    min: [0, "Weight cannot be negative"]
  },
  gender: {
    type: String,
    required: [true, "Gender is required"],
    enum: {
      values: ["male", "female"],
      message: "Gender must be either 'male' or 'female'"
    }
  },
  trainingStatus: {
    type: String,
    required: [true, "Training status is required"],
    enum: {
      values: ["intensive", "basic", "none"],
      message: "Training status must be one of: 'intensive', 'basic', 'none'"
    },
    default: "none"
  },
  reserved: {
    type: Boolean,
    default: false
  },
  inServiceCountry: {
    type: String,
    required: [true, "In-service country is required"],
    trim: true
  },
  acquisitionDate: {
    type: Date,
    required: [true, "Acquisition date is required"]
  },
  acquisitionLocation: {
    type: String,
    required: [true, "Acquisition location is required"],
    trim: true
  }
}, { timestamps: true });

// ✅ Export Dog model
module.exports = mongoose.model("Dog", dogSchema);
