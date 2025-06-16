// tests/monkeySearch.test.js

require("module-alias/register");

// Extend timeout for MongoDB queries
jest.setTimeout(20000);

const request = require("supertest");
const { app, server } = require("@server"); // Ensure server.js uses @middleware correctly
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

// Use correct alias for validation
const validateMonkey = require("@middleware/validateMonkey");

// Create test JWT token
const token = jwt.sign(
  { username: "testuser" },
  process.env.JWT_SECRET || "secret123",
  { expiresIn: "1h" }
);

// Load monkey test data from a JSON file
const monkeysPath = path.join(__dirname, "../monkeys.json");
const monkeys = JSON.parse(fs.readFileSync(monkeysPath, "utf8"));

// Select a sample monkey that has id, name, and species
const sampleMonkey = monkeys.find(
  (m) => m.id && m.name && m.species !== undefined
);

// Gracefully shutdown server after all tests
afterAll((done) => {
  if (server && server.close) {
    server.close(done);
  } else {
    done();
  }
});

// ==================== MONKEY SEARCH API TEST CASES ==================== //

describe("Monkey Search API /monkeys/search", () => {
  
  it(" should find a monkey by ID using binary search", async () => {
    const res = await request(app)
      .get(`/monkeys/search?id=${sampleMonkey.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.results[0].id).toBe(sampleMonkey.id);
  });

  it(" should return 404 for non-existent ID", async () => {
    const res = await request(app)
      .get("/monkeys/search?id=DOES_NOT_EXIST")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.error || res.body.message).toMatch(/not found/i);
  });

  it(" should filter monkeys by partial name", async () => {
    const nameFragment = sampleMonkey.name.substring(0, 2); // Use part of the name to filter
    const res = await request(app)
      .get(`/monkeys/search?name=${encodeURIComponent(nameFragment)}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.results.length).toBeGreaterThan(0);
    expect(res.body.results[0].name.toLowerCase()).toContain(nameFragment.toLowerCase());
  });

  it(" should filter monkeys by species", async () => {
    const species = sampleMonkey.species; // Use sample monkey species for search
    const res = await request(app)
      .get(`/monkeys/search?species=${encodeURIComponent(species)}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.results.length).toBeGreaterThan(0);
    expect(res.body.results[0].species.toLowerCase()).toBe(species.toLowerCase());
  });

  it(" should filter monkeys by reserved status", async () => {
    const reserved = sampleMonkey.reserved; // Filter using reserved status
    const res = await request(app)
      .get(`/monkeys/search?reserved=${reserved}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.results.length).toBeGreaterThan(0);
    expect(res.body.results[0].reserved).toBe(reserved);
  });

  it(" should reject access without JWT", async () => {
    const res = await request(app).get("/monkeys/search");
    
    expect(res.statusCode).toBe(401); // Unauthorized error if token is missing
    expect(res.body.message || res.body.error).toMatch(/unauthorized/i);
  });
});
