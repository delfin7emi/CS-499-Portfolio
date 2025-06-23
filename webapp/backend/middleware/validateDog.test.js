// ============================================
// Dog Validation Middleware Unit Tests
// Validates field-level middleware for /dogs
// ============================================

const request = require("supertest");
const express = require("express");

// Import the middleware to test
const validateDog = require("../../middleware/validateDog");

// Create a mock Express app
const app = express();
app.use(express.json());

// Register test route using the middleware
app.post("/test-dog", validateDog, (req, res) => {
  res.status(200).json({ message: "Dog validated successfully" });
});

describe("✅ validateDog Middleware", () => {

  // ✅ Test 1: Valid dog object should pass
  test("passes validation with valid dog data", async () => {
    const validDog = {
      id: "D100",
      name: "Buddy",
      breed: "Labrador",
      gender: "Male",
      age: 4,
      weight: 30,
      acquisitionDate: "2024-01-01",
      acquisitionLocation: "New York",
      trainingStatus: "In Training",
      reserved: false,
      inServiceCountry: "USA"
    };

    const res = await request(app).post("/test-dog").send(validDog);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Dog validated successfully");
  });

  // ❌ Test 2: Missing required string field
  test("fails when a required string field is missing", async () => {
    const invalidDog = {
      id: "D101",
      name: "Rex",
      // breed is missing
      gender: "Male",
      age: 3,
      weight: 25,
      acquisitionDate: "2024-01-01",
      acquisitionLocation: "Texas",
      trainingStatus: "Available",
      reserved: true,
      inServiceCountry: "USA"
    };

    const res = await request(app).post("/test-dog").send(invalidDog);

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/Missing or invalid field: breed/);
  });

  // ❌ Test 3: Invalid gender enum
  test("fails with invalid gender", async () => {
    const invalidDog = {
      id: "D102",
      name: "Max",
      breed: "Beagle",
      gender: "Unknown", // not "Male" or "Female"
      age: 2,
      weight: 20,
      acquisitionDate: "2024-01-01",
      acquisitionLocation: "Florida",
      trainingStatus: "Available",
      reserved: false,
      inServiceCountry: "USA"
    };

    const res = await request(app).post("/test-dog").send(invalidDog);

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/Invalid gender/);
  });

  // ❌ Test 4: Invalid trainingStatus enum
  test("fails with invalid training status", async () => {
    const invalidDog = {
      id: "D103",
      name: "Charlie",
      breed: "Poodle",
      gender: "Female",
      age: 5,
      weight: 22,
      acquisitionDate: "2024-01-01",
      acquisitionLocation: "Oregon",
      trainingStatus: "Unknown", // Not allowed
      reserved: false,
      inServiceCountry: "USA"
    };

    const res = await request(app).post("/test-dog").send(invalidDog);

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/Invalid trainingStatus/);
  });

  // ❌ Test 5: Negative age and weight
  test("fails when age or weight is negative", async () => {
    const invalidDog = {
      id: "D104",
      name: "Bella",
      breed: "Boxer",
      gender: "Female",
      age: -2,           // Invalid
      weight: -10,       // Invalid
      acquisitionDate: "2024-01-01",
      acquisitionLocation: "Nevada",
      trainingStatus: "In Service",
      reserved: false,
      inServiceCountry: "USA"
    };

    const res = await request(app).post("/test-dog").send(invalidDog);

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/Age must be a non-negative number|Weight must be a non-negative number/);
  });

  // ❌ Test 6: Reserved field must be boolean
  test("fails when reserved is not a boolean", async () => {
    const invalidDog = {
      id: "D105",
      name: "Rocky",
      breed: "Collie",
      gender: "Male",
      age: 3,
      weight: 45,
      acquisitionDate: "2024-01-01",
      acquisitionLocation: "Ohio",
      trainingStatus: "Available",
      reserved: "yes", // Should be true/false, not string
      inServiceCountry: "USA"
    };

    const res = await request(app).post("/test-dog").send(invalidDog);

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/Reserved must be a boolean/);
  });

});
