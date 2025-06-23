// ==================== Load Environment ====================
require("dotenv").config();
jest.setTimeout(120000); // Prevent timeout for slow DB ops

// ==================== Imports ====================
const request = require("supertest");
const path = require("path");
const jwt = require("jsonwebtoken");
const { app } = require("../server"); // ✅ Uses exported Express app
const Monkey = require("../models/Monkeys"); // ✅ Correct model
const { connectTestDb, disconnectTestDb } = require("../utils/testDbConnect");
const authenticateToken = require("../middleware/authMiddleware"); // ✅ Middleware path

// ==================== JWT Token Setup ====================
const JWT_TOKEN = jwt.sign(
  { username: "testuser" },
  process.env.JWT_SECRET || "secret123",
  { expiresIn: "1h" }
);

// ==================== Setup & Teardown ====================
beforeAll(async () => {
  await connectTestDb(); // ✅ Connect to test DB
});

beforeEach(async () => {
  await Monkey.deleteMany(); // ✅ Clear DB before each test

  // ✅ Insert monkeys with all required fields and valid enum values
  await Monkey.insertMany([
    {
      id: "M001",
      name: "Zuri",
      species: "Capuchin",
      tailLength: 25,
      bodyLength: 55,
      height: 45,
      gender: "female", // ✅ lowercase
      age: 5,
      weight: 17,
      acquisitionDate: new Date("2023-05-12"),
      acquisitionLocation: "Ecuador",
      trainingStatus: "basic", // ✅ lowercase
      reserved: false,
      inServiceCountry: "USA"
    },
    {
      id: "M002",
      name: "Bo",
      species: "Marmoset",
      tailLength: 20,
      bodyLength: 50,
      height: 40,
      gender: "male", // ✅ lowercase
      age: 4,
      weight: 14,
      acquisitionDate: new Date("2022-09-01"),
      acquisitionLocation: "Peru",
      trainingStatus: "intensive", // ✅ lowercase
      reserved: true,
      inServiceCountry: "Canada"
    }
  ]);
});

afterAll(async () => {
  await disconnectTestDb(); // ✅ Clean disconnect after all tests
});

// ==================== Test Suite: GET /monkeys/search ====================
describe("GET /monkeys/search", () => {
  it("should return a monkey by ID using binary search", async () => {
    const res = await request(app)
      .get("/monkeys/search?id=M001")
      .set("Authorization", `Bearer ${JWT_TOKEN}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.results).toHaveLength(1);
    expect(res.body.results[0].id).toBe("M001");
  });

  it("should return 404 for a non-existent monkey ID", async () => {
    const res = await request(app)
      .get("/monkeys/search?id=Z999")
      .set("Authorization", `Bearer ${JWT_TOKEN}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toMatch(/not found/i);
  });

  it("should filter monkeys by partial name", async () => {
    const res = await request(app)
      .get("/monkeys/search?name=bo")
      .set("Authorization", `Bearer ${JWT_TOKEN}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.results[0].name.toLowerCase()).toContain("bo");
  });

  it("should filter monkeys by reserved=true", async () => {
    const res = await request(app)
      .get("/monkeys/search?reserved=true")
      .set("Authorization", `Bearer ${JWT_TOKEN}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.results[0].reserved).toBe(true);
  });

  it("should reject unauthorized requests", async () => {
    const res = await request(app).get("/monkeys/search?id=M001");

    expect(res.statusCode).toBe(401);
    expect(res.body.message || res.text).toMatch(/unauthorized/i);
  });
});
