// Load environment variables
require("dotenv").config();

// ==================== LOAD INDIVIDUAL TEST FILES WITH LOGGING ====================

console.log("\n🔐 Running authController tests...");
require("./authController.test");

console.log("\n📈 Running binarySearch tests...");
require("./binarySearch.test");

console.log("\n🐶 Running dogPost tests...");
require("./dogPost.test");

console.log("\n🔍 Running dogSearch tests...");
require("./dogSearch.test");

console.log("\n🐒 Running monkeyPost tests...");
require("./monkeyPost.test");

console.log("\n🔍 Running monkeySearch tests...");
require("./monkeySearch.test");
