// ==================== Load .env Variables ====================
require("dotenv").config();
jest.setTimeout(120000); // Prevent timeout on slow test runs

// ==================== Imports ====================
const request = require("supertest");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Dog = require("../models/Dogs");

// ✅ FIXED: Import only the app from server.js (not the whole module)
const { app } = require("../server");

const { connectTestDb, disconnectTestDb } = require("../utils/testDbConnect");

// ==================== JWT Setup ====================
const JWT_TOKEN = jwt.sign(
  { username: "testuser" },
  process.env.JWT_SECRET || "secret123",
  { expiresIn: "1h" }
);

// ==================== Setup & Teardown ====================
beforeAll(async () => {
  await connectTestDb(); // Connect once before all tests
});

beforeEach(async () => {
  await Dog.deleteMany(); // Clean DB for isolated tests

  await Dog.insertMany([
    {
      id: "D001",
      name: "Rex",
      breed: "German Shepherd",
      age: 4,
      weight: 70,
      gender: "male",
      trainingStatus: "intensive",
      reserved: false,
      acquisitionDate: new Date(),
      acquisitionLocation: "Portland",
      inServiceCountry: "US"
    },
    {
      id: "D002",
      name: "Luna",
      breed: "Labrador",
      age: 3,
      weight: 55,
      gender: "female",
      trainingStatus: "basic",
      reserved: true,
      acquisitionDate: new Date(),
      acquisitionLocation: "Salem",
      inServiceCountry: "US"
    }
  ]);
});

afterAll(async () => {
  await disconnectTestDb(); // Disconnect after all tests
  await new Promise(res => setTimeout(res, 500)); // Let Jest exit cleanly
});

// ==================== Test Suite: GET /dogs/search ====================
describe("GET /dogs/search", () => {

  it("should find a dog by ID using binary search", async () => {
    const res = await request(app)
      .get("/dogs/search?id=D001")
      .set("Authorization", `Bearer ${JWT_TOKEN}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.results).toHaveLength(1);
    expect(res.body.results[0].id).toBe("D001");
  });

  it("should return 404 for non-existent ID", async () => {
    const res = await request(app)
      .get("/dogs/search?id=Z999")
      .set("Authorization", `Bearer ${JWT_TOKEN}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toMatch(/not found/i);
  });

  it("should filter dogs by partial name (fallback)", async () => {
    const res = await request(app)
      .get("/dogs/search?name=lu")
      .set("Authorization", `Bearer ${JWT_TOKEN}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.results.length).toBe(1);
    expect(res.body.results[0].name.toLowerCase()).toContain("lu");
  });

  it("should filter dogs by trainingStatus (fallback)", async () => {
    const res = await request(app)
      .get("/dogs/search?trainingStatus=intensive")
      .set("Authorization", `Bearer ${JWT_TOKEN}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.results[0].trainingStatus).toBe("intensive");
  });

  it("should filter dogs by reserved=true (fallback)", async () => {
    const res = await request(app)
      .get("/dogs/search?reserved=true")
      .set("Authorization", `Bearer ${JWT_TOKEN}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.results[0].reserved).toBe(true);
  });

  it("should reject unauthorized requests (missing token)", async () => {
    const res = await request(app)
      .get("/dogs/search?id=D001"); // No token

    expect(res.statusCode).toBe(401);
    expect(res.body.message || res.text).toMatch(/unauthorized/i);
  });

});
