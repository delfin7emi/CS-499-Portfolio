// utils/testDbConnect.js

const mongoose = require("mongoose");

let isConnected = false;
let currentUri = "";

// Recommended for Mongoose >= 6
mongoose.set("strictQuery", true);

/**
 * Connect to the test MongoDB database.
 * Prevents reconnecting unnecessarily and handles clean reconnection.
 */
async function connectTestDb() {
  const uri = process.env.MONGODB_URI_TEST || "mongodb://127.0.0.1:27017/grazioso_test";

  // Already connected to the same URI
  if (mongoose.connection.readyState === 1 && currentUri === uri) {
    console.log("✅ MongoDB already connected to test DB");
    return;
  }

  // If connected to a different URI, disconnect first
  if (mongoose.connection.readyState === 1 && currentUri !== uri) {
    console.log("⚠️ Disconnecting from previous DB before reconnecting...");
    await mongoose.disconnect();
  }

  // Attempt fresh connection
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000 // fail fast if server unreachable
    });

    // Confirm connection open
    await new Promise((resolve, reject) => {
      mongoose.connection.once("open", resolve);
      mongoose.connection.on("error", reject);
    });

    isConnected = true;
    currentUri = uri;
    console.log(`✅ MongoDB connected to ${uri}`);
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    throw err;
  }
}

/**
 * Disconnect cleanly from the test database after tests finish.
 */
async function disconnectTestDb() {
  try {
    await mongoose.connection.close();
    isConnected = false;
    currentUri = "";
    console.log("🔌 MongoDB connection closed");
  } catch (err) {
    console.error("❌ Error disconnecting MongoDB:", err);
  }
}

module.exports = {
  connectTestDb,
  disconnectTestDb
};
