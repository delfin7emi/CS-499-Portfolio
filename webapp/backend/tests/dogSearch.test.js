// tests/dogSearch.test.js

const request = require("supertest"); // For API testing
const { app, server } = require("../server"); // Import Express app and server
const jwt = require("jsonwebtoken"); // For generating a test token
const fs = require("fs");
const path = require("path");

//  Create a test JWT token (ensure your .env has JWT_SECRET or use fallback)
const token = jwt.sign(
  { username: "testuser123" },
  process.env.JWT_SECRET || "secret123",
  { expiresIn: "1h" }
);

//  Read dog data from the local JSON file
const dogsPath = path.join(__dirname, "../dogs.json");
const dogs = JSON.parse(fs.readFileSync(dogsPath, "utf8"));

//  Select the first dog with an ID to ensure it works for binary search
const sampleDog = dogs.find((dog) => dog.id);

//  Shutdown server after all tests
afterAll(() => {
  if (server && server.close) {
    server.close();
  }
});

describe("Dog Search API /dogs/search", () => {
  //  Binary Search test by ID
  it("should find a dog by ID using binary search", async () => {
    const res = await request(app)
      .get(`/dogs/search?id=${sampleDog.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200); // Expect HTTP 200
    expect(res.body.results).toBeDefined(); // Ensure results array is returned
    expect(res.body.results[0].id).toBe(sampleDog.id); // ID should match
  });

  //  ID not found should return 404
  it("should return 404 for non-existent ID", async () => {
    const res = await request(app)
      .get("/dogs/search?id=NOT_REAL_ID")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(404); // Expect not found
    expect(res.body.error).toMatch(/not found/i); // Error message should mention "not found"
  });

  //  Fallback search by partial name
  it("should fallback to filter by name", async () => {
    const name = sampleDog.name?.substring(0, 3); // Use partial match for name
    const res = await request(app)
      .get(`/dogs/search?name=${encodeURIComponent(name)}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200); // Expect success
    expect(res.body.results.length).toBeGreaterThan(0); // Should return at least one result
    expect(res.body.results[0].name.toLowerCase()).toContain(name.toLowerCase());
  });

  //  Fallback search by trainingStatus
  it("should fallback to filter by trainingStatus", async () => {
    const status = sampleDog.trainingStatus;
    const res = await request(app)
      .get(`/dogs/search?status=${encodeURIComponent(status)}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.results.length).toBeGreaterThan(0);
    expect(res.body.results[0].trainingStatus.toLowerCase()).toBe(status.toLowerCase());
  });

  //  Fallback search by reserved boolean
  it("should fallback to filter by reserved flag", async () => {
    const reserved = sampleDog.reserved;
    const res = await request(app)
      .get(`/dogs/search?reserved=${reserved}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.results.length).toBeGreaterThan(0);
    expect(res.body.results[0].reserved).toBe(reserved);
  });

  //  Should reject unauthorized access
  it("should reject access without JWT", async () => {
    const res = await request(app).get("/dogs/search");
    expect(res.statusCode).toBe(401); // Expect unauthorized
    expect(res.body.message || res.body.error).toMatch(/unauthorized/i);
  });
});

describe("Dog POST API /dogs", () => {
  //  Create new dog entry
  it("should add a new dog entry", async () => {
    const newDog = {
      id: "D777",
      name: "Shadow",
      breed: "Husky",
      age: 4,
      gender: "Male",
      weight: 60,
      acquisitionDate: "2025-06-14",
      acquisitionLocation: "Nevada",
      trainingStatus: "in training",
      reserved: false,
      inServiceCountry: "US"
    };

    const res = await request(app)
      .post("/dogs")
      .set("Authorization", `Bearer ${token}`)
      .send(newDog);

    expect(res.statusCode).toBe(201); // Created
    expect(res.body.message.toLowerCase()).toContain("dog saved");
    expect(res.body.dog).toHaveProperty("id", "D777");
  });

  //  Unauthorized POST attempt
  it("should reject POST without token", async () => {
    const res = await request(app).post("/dogs").send({ id: "D888" });

    expect(res.statusCode).toBe(401); // Unauthorized
    expect(res.body.message || res.body.error).toMatch(/unauthorized/i);
  });
});
