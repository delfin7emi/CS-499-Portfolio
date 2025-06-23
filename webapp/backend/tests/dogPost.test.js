// ==================== Load Environment ====================
require("dotenv").config();
jest.setTimeout(120000); // Extend timeout

// ==================== Imports ====================
const request = require("supertest");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { app } = require("../server");
const { connectTestDb, disconnectTestDb } = require("../utils/testDbConnect");
const Dog = require("../models/Dogs");

// ==================== JWT Setup ====================
const JWT_TOKEN = jwt.sign(
  { username: "testuser" },
  process.env.JWT_SECRET || "secret123",
  { expiresIn: "1h" }
);

// ==================== Test Environment Setup ====================
beforeAll(async () => {
  await connectTestDb();
});

afterAll(async () => {
  await disconnectTestDb();
  await new Promise((res) => setTimeout(res, 500));
});

beforeEach(async () => {
  await Dog.deleteMany();
});

// ==================== Test Suite ====================
describe("POST /dogs", () => {
  it("should return 400 if required fields are missing", async () => {
    const res = await request(app)
      .post("/dogs")
      .set("Authorization", `Bearer ${JWT_TOKEN}`)
      .send({}); // Missing all fields

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("should reject invalid gender or trainingStatus", async () => {
    const res = await request(app)
      .post("/dogs")
      .set("Authorization", `Bearer ${JWT_TOKEN}`)
      .send({
        id: "D001",
        name: "Baxter",
        breed: "Beagle",
        age: 3,
        weight: 40,
        gender: "robot", // ❌ Invalid
        trainingStatus: "overtrained", // ❌ Invalid
        reserved: false,
        inServiceCountry: "USA",
        acquisitionDate: new Date(),
        acquisitionLocation: "Texas"
      });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("should reject negative age or weight", async () => {
    const res = await request(app)
      .post("/dogs")
      .set("Authorization", `Bearer ${JWT_TOKEN}`)
      .send({
        id: "D002",
        name: "Lucky",
        breed: "Husky",
        age: -2, // ❌
        weight: -10, // ❌
        gender: "male",
        trainingStatus: "basic",
        reserved: false,
        inServiceCountry: "USA",
        acquisitionDate: new Date(),
        acquisitionLocation: "Oregon"
      });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("should reject duplicate dog ID", async () => {
    const dog = {
      id: "D100",
      name: "Nova",
      breed: "Retriever",
      age: 4,
      weight: 60,
      gender: "female",
      trainingStatus: "intensive",
      reserved: false,
      inServiceCountry: "USA",
      acquisitionDate: new Date(),
      acquisitionLocation: "Florida"
    };

    const res1 = await request(app)
      .post("/dogs")
      .set("Authorization", `Bearer ${JWT_TOKEN}`)
      .send(dog);

    expect(res1.statusCode).toBe(201);

    const res2 = await request(app)
      .post("/dogs")
      .set("Authorization", `Bearer ${JWT_TOKEN}`)
      .send(dog);

    expect(res2.statusCode).toBe(400);
    expect(res2.body).toHaveProperty("error");
  });

  it("should create a new dog successfully", async () => {
    const dog = {
      id: "D200",
      name: "Shadow",
      breed: "Doberman",
      age: 5,
      weight: 65,
      gender: "male",
      trainingStatus: "basic",
      reserved: false,
      inServiceCountry: "USA",
      acquisitionDate: new Date(),
      acquisitionLocation: "California"
    };

    const res = await request(app)
      .post("/dogs")
      .set("Authorization", `Bearer ${JWT_TOKEN}`)
      .send(dog);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("message", "Dog created");
    expect(res.body.dog).toHaveProperty("id", "D200");
  });

  it("should reject dog creation without token", async () => {
    const res = await request(app)
      .post("/dogs")
      .send({
        id: "D300",
        name: "Scout",
        breed: "Collie",
        age: 3,
        weight: 45,
        gender: "male",
        trainingStatus: "basic",
        reserved: false,
        inServiceCountry: "USA",
        acquisitionDate: new Date(),
        acquisitionLocation: "Nevada"
      });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("message");
  });
});
