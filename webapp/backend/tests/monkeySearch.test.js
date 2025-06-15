const request = require("supertest");
const { app, server } = require("../server");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

//  Create test JWT token using fallback secret
const token = jwt.sign(
  { username: "testuser" },
  process.env.JWT_SECRET || "secret123",
  { expiresIn: "1h" }
);

//  Load monkey data from file
const monkeysPath = path.join(__dirname, "../monkeys.json");
const monkeys = JSON.parse(fs.readFileSync(monkeysPath, "utf8"));
const sampleMonkey = monkeys.find((m) => m.id);

//  Shut down the server after tests
afterAll(() => {
  if (server && server.close) {
    server.close();
  }
});

describe("Monkey Search API /monkeys/search", () => {
  it("should find a monkey by ID using binary search", async () => {
    const res = await request(app)
      .get(`/monkeys/search?id=${sampleMonkey.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.results[0].id).toBe(sampleMonkey.id);
  });

  it("should return 404 for non-existent ID", async () => {
    const res = await request(app)
      .get("/monkeys/search?id=M999")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toMatch(/not found/i); //  Loosen the pattern
  });

  it("should filter monkeys by partial name", async () => {
    const name = sampleMonkey.name.substring(0, 2);
    const res = await request(app)
      .get(`/monkeys/search?name=${encodeURIComponent(name)}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.results.length).toBeGreaterThan(0);
    expect(res.body.results[0].name.toLowerCase()).toContain(name.toLowerCase());
  });

  it("should filter monkeys by species", async () => {
    const species = sampleMonkey.species;
    const res = await request(app)
      .get(`/monkeys/search?species=${encodeURIComponent(species)}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.results.length).toBeGreaterThan(0);
    expect(res.body.results[0].species.toLowerCase()).toBe(species.toLowerCase());
  });

  it("should filter monkeys by reserved status", async () => {
    const reserved = sampleMonkey.reserved;
    const res = await request(app)
      .get(`/monkeys/search?reserved=${reserved}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.results.length).toBeGreaterThan(0);
    expect(res.body.results[0].reserved).toBe(reserved);
  });

  it("should reject access without JWT", async () => {
    const res = await request(app).get("/monkeys/search");

    expect(res.statusCode).toBe(401);
    expect(res.body.message || res.body.error).toMatch(/unauthorized/i);
  });
});
