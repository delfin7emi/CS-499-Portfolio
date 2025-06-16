// tests/dogSearch.test.js

require("module-alias/register");

jest.setTimeout(30000); // Allow time for DB operations

const request = require("supertest");
const { app, server } = require("../server");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const Dog = require("../models/Dogs"); // Direct path (avoids alias issues)

// Generate a test JWT token
const token = jwt.sign(
  { username: "testuser123" },
  process.env.JWT_SECRET || "secret123",
  { expiresIn: "1h" }
);

// Load a sample dog from the JSON file
const dogsPath = path.join(__dirname, "../dogs.json");
const dogs = JSON.parse(fs.readFileSync(dogsPath, "utf8"));
const sampleDog = dogs.find(d => d.id); // Select first available dog with ID

if (!sampleDog) {
  throw new Error(" No sample dog found in dogs.json for testing.");
}

// ==================== Setup / Teardown ==================== //

beforeAll(async () => {
  await mongoose.connect("mongodb://127.0.0.1:27017/grazioso_test", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  // Cleanup the inserted test dog (if created)
  await Dog.deleteOne({ id: "D777" });

  await mongoose.connection.close();

  if (server && typeof server.close === "function") {
    await new Promise(resolve => server.close(resolve));
  }
});

// ==================== DOG SEARCH TESTS ==================== //

describe("GET /dogs/search", () => {
  it("should find a dog by ID using binary search", async () => {
    const res = await request(app)
      .get(`/dogs/search?id=${sampleDog.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.results)).toBe(true);
    expect(res.body.results[0].id).toBe(sampleDog.id);
  });

  it("should return 404 for non-existent ID", async () => {
    const res = await request(app)
      .get("/dogs/search?id=NOT_REAL_ID")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toMatch(/not found/i);
  });

  it("should fallback to filter by name", async () => {
    const partialName = sampleDog.name?.substring(0, 3) || "";
    const res = await request(app)
      .get(`/dogs/search?name=${encodeURIComponent(partialName)}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.results.length).toBeGreaterThan(0);
    expect(res.body.results[0].name.toLowerCase()).toContain(partialName.toLowerCase());
  });

  it("should fallback to filter by trainingStatus", async () => {
    const status = sampleDog.trainingStatus;
    const res = await request(app)
      .get(`/dogs/search?trainingStatus=${encodeURIComponent(status)}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.results.length).toBeGreaterThan(0);
    expect(res.body.results[0].trainingStatus).toBe(status);
  });

  it("should fallback to filter by reserved status", async () => {
    const reserved = sampleDog.reserved;
    const res = await request(app)
      .get(`/dogs/search?reserved=${reserved}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.results.length).toBeGreaterThan(0);
    expect(res.body.results[0].reserved).toBe(reserved);
  });

  it("should reject access without JWT token", async () => {
    const res = await request(app).get("/dogs/search");

    expect(res.statusCode).toBe(401);
    expect(res.body.message || res.body.error).toMatch(/unauthorized/i);
  });
});

// ==================== DOG POST TESTS ==================== //

describe("POST /dogs", () => {
  const dogId = "D777";

  afterAll(async () => {
    await Dog.deleteOne({ id: dogId });
  });

  it("should successfully create a new dog", async () => {
    const newDog = {
      id: dogId,
      name: "Shadow",
      breed: "Husky",
      age: 4,
      gender: "Male",
      weight: 60,
      acquisitionDate: "2025-06-14",
      acquisitionLocation: "Nevada",
      trainingStatus: "In Training",
      reserved: false,
      inServiceCountry: "US"
    };

    const res = await request(app)
      .post("/dogs")
      .set("Authorization", `Bearer ${token}`)
      .send(newDog);

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toMatch(/dog/i);
    expect(res.body.dog).toHaveProperty("id", dogId);
  });

  it("should reject POST without token", async () => {
    const res = await request(app)
      .post("/dogs")
      .send({ id: "D888", name: "NoAuthDog", breed: "Lab" });

    expect(res.statusCode).toBe(401);
    expect(res.body.message || res.body.error).toMatch(/unauthorized/i);
  });
});
