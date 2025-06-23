// ==================== tests/monkeyPost.test.js ====================

require("dotenv").config();
jest.setTimeout(120000);

const request = require("supertest");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { app } = require("../server");
const Monkey = require("../models/Monkeys");
const { connectTestDb, disconnectTestDb } = require("../utils/testDbConnect");

mongoose.set("bufferCommands", false);

const JWT_TOKEN = jwt.sign(
  { username: "testuser" },
  process.env.JWT_SECRET || "secret123",
  { expiresIn: "1h" }
);

beforeAll(connectTestDb);

beforeEach(async () => {
  await Monkey.deleteMany();
});

afterAll(async () => {
  await disconnectTestDb();
  await new Promise((res) => setTimeout(res, 1000));
});

describe("POST /monkeys", () => {
  it("should return 400 if required fields are missing", async () => {
    const res = await request(app)
      .post("/monkeys")
      .set("Authorization", `Bearer ${JWT_TOKEN}`)
      .send({});
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("should reject invalid species or tailLength", async () => {
    const res = await request(app)
      .post("/monkeys")
      .set("Authorization", `Bearer ${JWT_TOKEN}`)
      .send({
        id: "M001",
        name: "Bobo",
        age: 4,
        weight: 22,
        height: 40,
        species: "Dragon",         // ❌ Invalid
        tailLength: -3,            // ❌ Invalid
        bodyLength: 19,
        gender: "female",
        trainingStatus: "basic",
        reserved: false,
        acquisitionDate: "2023-01-01",
        acquisitionLocation: "Brazil",
        inServiceCountry: "USA"
      });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("should reject duplicate monkey ID", async () => {
    const monkey = {
      id: "M123",
      name: "Kiki",
      age: 5,
      weight: 25,
      height: 45,
      species: "Capuchin",
      tailLength: 12,
      bodyLength: 18,
      gender: "male",
      trainingStatus: "intensive",
      reserved: false,
      acquisitionDate: "2023-01-01",
      acquisitionLocation: "Panama",
      inServiceCountry: "USA"
    };

    const res1 = await request(app)
      .post("/monkeys")
      .set("Authorization", `Bearer ${JWT_TOKEN}`)
      .send(monkey);
    expect(res1.statusCode).toBe(201);

    const res2 = await request(app)
      .post("/monkeys")
      .set("Authorization", `Bearer ${JWT_TOKEN}`)
      .send(monkey);
    expect(res2.statusCode).toBe(409);
    expect(res2.body).toHaveProperty("error", "Duplicate monkey ID");
  });

  it("should create a new monkey successfully", async () => {
    const monkeyData = {
      id: "M999",
      name: "Zazu",
      age: 2,
      weight: 18,
      height: 38,
      species: "Marmoset",
      tailLength: 10,
      bodyLength: 15,
      gender: "male",                // ✅ must be lowercase
      trainingStatus: "basic",       // ✅ must be lowercase
      reserved: false,
      acquisitionDate: "2024-01-01",
      acquisitionLocation: "Ecuador",
      inServiceCountry: "USA"
    };

    const res = await request(app)
      .post("/monkeys")
      .set("Authorization", `Bearer ${JWT_TOKEN}`)
      .send(monkeyData);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("message", "Monkey created");
    expect(res.body.monkey).toHaveProperty("id", monkeyData.id);
  });

  it("should reject request without a token", async () => {
    const monkeyData = {
      id: "M200",
      name: "Kiki",
      species: "Capuchin",
      tailLength: 30,
      height: 40,
      bodyLength: 50,
      gender: "female",               // lowercase
      age: 4,
      weight: 12,
      acquisitionDate: "2024-01-01",
      acquisitionLocation: "Brazil",
      trainingStatus: "basic",        // lowercase
      reserved: false,
      inServiceCountry: "USA"
    };


    const res = await request(app)
      .post("/monkeys")
      .send(monkeyData);

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("message");
  });
});
