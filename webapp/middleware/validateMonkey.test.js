// ============================================
// Unit Tests for validateMonkey Middleware
// Path: tests/middleware/validateMonkey.test.js
// ============================================

const request = require("supertest");
const express = require("express");
const validateMonkey = require("../../middleware/validateMonkey");

const app = express();
app.use(express.json());

// Temporary test route using validateMonkey middleware
app.post("/test-monkey", validateMonkey, (req, res) => {
  res.status(200).json({ message: "Monkey validated successfully" });
});

describe("validateMonkey Middleware", () => {

  test("passes validation with valid monkey data", async () => {
    const validMonkey = {
      id: "M100",
      name: "Coco",
      species: "Capuchin",
      tailLength: 30,
      height: 40,
      bodyLength: 50,
      gender: "Female",
      age: 5,
      weight: 12,
      acquisitionDate: "2024-01-01",
      acquisitionLocation: "Brazil",
      trainingStatus: "In Training",
      reserved: false,
      inServiceCountry: "USA"
    };

    const res = await request(app).post("/test-monkey").send(validMonkey);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Monkey validated successfully");
  });

  test("fails validation when a required string field is missing", async () => {
    const invalidMonkey = {
      id: "M101",
      name: "Luna",
      // species is missing
      tailLength: 30,
      height: 40,
      bodyLength: 50,
      gender: "Female",
      age: 5,
      weight: 12,
      acquisitionDate: "2024-01-01",
      acquisitionLocation: "Peru",
      trainingStatus: "Available",
      reserved: true,
      inServiceCountry: "USA"
    };

    const res = await request(app).post("/test-monkey").send(invalidMonkey);
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/species/i);
  });

  test("fails validation with invalid gender", async () => {
    const invalidMonkey = {
      id: "M102",
      name: "Zippy",
      species: "Squirrel Monkey",
      tailLength: 28,
      height: 33,
      bodyLength: 38,
      gender: "Unknown",
      age: 3,
      weight: 8,
      acquisitionDate: "2024-01-01",
      acquisitionLocation: "Colombia",
      trainingStatus: "In Training",
      reserved: false,
      inServiceCountry: "USA"
    };

    const res = await request(app).post("/test-monkey").send(invalidMonkey);
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/invalid gender/i);
  });

  test("fails validation with invalid training status", async () => {
    const invalidMonkey = {
      id: "M103",
      name: "Nina",
      species: "Howler",
      tailLength: 45,
      height: 50,
      bodyLength: 55,
      gender: "Male",
      age: 6,
      weight: 10,
      acquisitionDate: "2024-01-01",
      acquisitionLocation: "Panama",
      trainingStatus: "Unknown",
      reserved: false,
      inServiceCountry: "USA"
    };

    const res = await request(app).post("/test-monkey").send(invalidMonkey);
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/invalid training status/i);
  });

  test("fails validation when numeric fields are negative", async () => {
    const invalidMonkey = {
      id: "M104",
      name: "Jax",
      species: "Tamarin",
      tailLength: -10,
      height: 25,
      bodyLength: 35,
      gender: "Male",
      age: -2,
      weight: -5,
      acquisitionDate: "2024-01-01",
      acquisitionLocation: "Costa Rica",
      trainingStatus: "Available",
      reserved: true,
      inServiceCountry: "USA"
    };

    const res = await request(app).post("/test-monkey").send(invalidMonkey);
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/must be a non-negative number/i);
  });
});
