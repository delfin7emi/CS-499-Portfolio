// ============================================
// Grazioso Rescue API Backend - server.js
// ============================================

// 🌿 Load environment variables from .env file
require("dotenv").config();

// ================== Core Dependencies ==================
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const cors = require("cors");

// ================== Initialize Express App ==================
const app = express();
const PORT = process.env.PORT || 3000;

// ================== Determine Database ==================
// Use test DB if NODE_ENV=test, else use production DB
const dbName = process.env.NODE_ENV === "test" ? "grazioso_test" : "grazioso";
const mongoUri = `mongodb://127.0.0.1:27017/${dbName}`;

// ================== Connect to MongoDB ==================
if (mongoose.connection.readyState === 0) {
  mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 20000 // connection timeout
  })
  .then(() => {
    if (process.env.NODE_ENV !== "test") {
      console.log(`✅ MongoDB connected to '${dbName}'`);
    }
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });
}

// ================== Global Middleware ==================
app.use(cors());                 // Allow cross-origin requests
app.use(express.json());        // Parse incoming JSON
app.use(morgan("dev"));         // Log HTTP requests

// Apply rate limiter globally
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,     // 15 minutes
  max: 100,                     // limit each IP to 100 requests per windowMs
  message: "⛔ Too many requests, please try again later.",
}));

// ================== Import & Mount Routes ==================
const authRoutes = require("./authController");
const dogRoutes = require("./routes/dogRoutes");
const monkeyRoutes = require("./routes/monkeyRoutes");

app.use("/auth", authRoutes);
app.use("/dogs", dogRoutes);
app.use("/monkeys", monkeyRoutes);

// ================== Root Endpoint ==================
app.get("/", (req, res) => {
  res.send("🐾 Grazioso Rescue API is running. Endpoints: /auth, /dogs, /monkeys");
});

// ================== Start Server (only if NOT testing) ==================
let serverInstance = null;

if (process.env.NODE_ENV !== "test") {
  serverInstance = app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
}

// ================== Disconnect Helper for Tests ==================
const disconnectDb = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    console.log("🔌 MongoDB connection closed");
  }
};

// ================== Export for Test Integration ==================
module.exports = {
  app,               // For Supertest
  server: serverInstance,  // For graceful shutdown (optional)
  disconnectDb       // For Jest teardown
};
