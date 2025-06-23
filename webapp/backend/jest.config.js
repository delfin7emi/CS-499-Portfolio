module.exports = {
  testEnvironment: "node",              // Use Node environment for backend
  testMatch: [                          // Match test files in the tests directory
    "**/tests/**/*.test.js"
  ],
  verbose: true,                        // Print individual test results
  detectOpenHandles: true,             // Helps identify hanging async operations
  forceExit: true,                     // Forces Jest to exit after tests complete
  setupFiles: ["dotenv/config"],       // Automatically load .env before tests
  moduleFileExtensions: ["js", "json"],
  transform: {},                        // Disable Babel transforms (not needed here)
  coveragePathIgnorePatterns: ["/node_modules/"],
  testTimeout: 100000                  // Extend timeout for slow DB operations
};
