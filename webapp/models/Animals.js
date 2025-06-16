const mongoose = require('mongoose');

const AnimalSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  species: {
    type: String,
    required: true,
    trim: true
  },
  trainingStatus: {
    type: String,
    required: true,
    enum: ["Available", "In Training", "Trained", "Adopted", "Unavailable"],
    default: "Available"
  },
  intakeDate: {
    type: Date,
    required: true,
    validate: {
      validator: function (date) {
        return date <= new Date();
      },
      message: "Intake date cannot be in the future"
    }
  }
}, { timestamps: true });

module.exports = mongoose.model('Animal', AnimalSchema);
