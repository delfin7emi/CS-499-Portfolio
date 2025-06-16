// tests/monkey.test.js

require("module-alias/register");

jest.setTimeout(100000); // Extend timeout for DB operations

const request = require("supertest");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { app, server } = require("@server");
const Monkey = require("@models/Monkeys"); // Use relative path to avoid Jest alias resolution issues

// Generate test JWT token
const token = jwt.sign(
  { username: "testuser" },
  process.env.JWT_SECRET || "secret123",
  { expiresIn: "1h" }
);

// Connect to MongoDB test database
beforeAll(async () => {
  await mongoose.connect("mongodb://127.0.0.1:27017/grazioso_test", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log(" Connected to test DB");
});

// Clean up inserted test data and close DB/server
afterAll(async () => {
  await Monkey.deleteMany({ id: { $in: ["M777", "M888", "M_DUP", "M_BAD"] } });
  await mongoose.connection.close();
  if (server && typeof server.close === "function") {
    await new Promise((resolve) => server.close(resolve));
  }
});

// ==================== MONKEY TEST CASES ==================== //

describe("POST /monkeys", () => {
  it(" should successfully create a monkey", async () => {
    const monkeyData = {
      id: "M777",
      name: "Zuri",
      species: "Squirrel Monkey",
      tailLength: 20,
      height: 35,
      bodyLength: 40,
      gender: "Female",
      age: 3,
      weight: 7,
      acquisitionDate: "2025-06-14T00:00:00.000Z",
      acquisitionLocation: "Florida",
      trainingStatus: "In Training",
      reserved: false,
      inServiceCountry: "US"
    };

    const res = await request(app)
      .post("/monkeys")
      .set("Authorization", `Bearer ${token}`)
      .send(monkeyData);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("message", "Monkey created");
    expect(res.body.monkey).toHaveProperty("id", "M777");
  });

  it(" should reject POST without auth token", async () => {
    const res = await request(app)
      .post("/monkeys")
      .send({ id: "M888", name: "Nala", species: "Capuchin" });

    expect(res.statusCode).toBe(401);
    expect(res.body.message || res.body.error).toMatch(/unauthorized/i);
  });

  it(" should return 400 if required fields are missing", async () => {
    const res = await request(app)
      .post("/monkeys")
      .set("Authorization", `Bearer ${token}`)
      .send({
        id: "M_BAD",
        name: "Kiko"
        // Missing required fields
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message || res.body.error).toMatch(/missing/i);
  });

  it(" should return 400 for invalid gender or trainingStatus", async () => {
    const res = await request(app)
      .post("/monkeys")
      .set("Authorization", `Bearer ${token}`)
      .send({
        id: "M_BAD",
        name: "InvalidOne",
        species: "Capuchin",
        tailLength: 25,
        height: 30,
        bodyLength: 35,
        gender: "Unknown", // Invalid
        age: 3,
        weight: 6,
        acquisitionDate: "2025-01-01",
        acquisitionLocation: "Texas",
        trainingStatus: "Untrained", // Invalid
        reserved: false,
        inServiceCountry: "US"
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message || res.body.error).toMatch(/invalid/i);
  });

  it(" should reject negative or invalid numeric values", async () => {
    const res = await request(app)
      .post("/monkeys")
      .set("Authorization", `Bearer ${token}`)
      .send({
        id: "M_BAD",
        name: "Buggy",
        species: "Capuchin",
        tailLength: -10, // Invalid
        height: 30,
        bodyLength: 40,
        gender: "Male",
        age: -2, // Invalid
        weight: -5, // Invalid
        acquisitionDate: "2025-01-01",
        acquisitionLocation: "Texas",
        trainingStatus: "Available",
        reserved: false,
        inServiceCountry: "US"
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message || res.body.error).toMatch(/invalid/i);
  });

  it(" should reject duplicate monkey ID", async () => {
    const monkey = {
      id: "M_DUP",
      name: "Original",
      species: "Howler",
      tailLength: 25,
      height: 33,
      bodyLength: 38,
      gender: "Male",
      age: 5,
      weight: 10,
      acquisitionDate: "2025-01-01",
      acquisitionLocation: "NY",
      trainingStatus: "Available",
      reserved: false,
      inServiceCountry: "US"
    };

    // First insert - should succeed
    await request(app)
      .post("/monkeys")
      .set("Authorization", `Bearer ${token}`)
      .send(monkey);

    // Second insert - should fail
    const res = await request(app)
      .post("/monkeys")
      .set("Authorization", `Bearer ${token}`)
      .send(monkey);

    expect(res.statusCode).toBe(409);
    expect(res.body.message || res.body.error).toMatch(/duplicate/i);
  });
});
