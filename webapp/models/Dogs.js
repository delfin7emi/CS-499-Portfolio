const mongoose = require('mongoose');

const DogSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  breed: { type: String, required: true },
  age: { type: Number, required: true, min: 0 },
  gender: { type: String, required: true, enum: ["Male", "Female"] },
  weight: { type: Number, required: true, min: 0 },
  acquisitionDate: { type: Date, required: true },
  acquisitionLocation: { type: String, required: true },
  trainingStatus: { type: String, required: true },
  reserved: { type: Boolean, default: false },
  inServiceCountry: { type: String, required: true }
});

module.exports = mongoose.model('Dog', DogSchema);
