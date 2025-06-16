module.exports = {
  testEnvironment: "node",
  testMatch: ["**/tests/test.js"], 
  setupFiles: ["module-alias/register"],
  moduleDirectories: ["node_modules", "<rootDir>"],
  moduleNameMapper: {
    "^@middleware/(.*)$": "<rootDir>/middleware/$1",
    "^@models/(.*)$": "<rootDir>/models/$1",
    "^@utils/(.*)$": "<rootDir>/utils/$1",
    "^@server$": "<rootDir>/server.js"
  }
};
