const mongoose = require('mongoose');

const MonkeySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  species: { type: String, required: true },
  tailLength: { type: Number, required: true, min: 0 },
  height: { type: Number, required: true, min: 0 },
  bodyLength: { type: Number, required: true, min: 0 },
  gender: { type: String, required: true, enum: ["Male", "Female"] },
  age: { type: Number, required: true, min: 0 },
  weight: { type: Number, required: true, min: 0 },
  acquisitionDate: { type: Date, required: true },
  acquisitionLocation: { type: String, required: true },
  trainingStatus: { type: String, required: true },
  reserved: { type: Boolean, default: false },
  inServiceCountry: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Monkey', MonkeySchema);
