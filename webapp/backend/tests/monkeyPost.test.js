const request = require("supertest");
const { app, server } = require("../server");
const jwt = require("jsonwebtoken");

// Create a test JWT token
const token = jwt.sign(
  { username: "testuser" },
  process.env.JWT_SECRET || "secret123",
  { expiresIn: "1h" }
);

// Shutdown server after tests
afterAll(() => {
  if (server && server.close) {
    server.close();
  }
});

describe("Monkey POST API /monkeys", () => {
  it("should add a new monkey entry", async () => {
    const newMonkey = {
      id: "M777",
      name: "Zuri",
      species: "Squirrel Monkey",
      gender: "Female",
      age: 3,
      weight: 7,
      acquisitionDate: "2025-06-14",
      acquisitionLocation: "Florida",
      reserved: false,
      inServiceCountry: "US"
    };

    const res = await request(app)
      .post("/monkeys")
      .set("Authorization", `Bearer ${token}`)
      .send(newMonkey);

    expect(res.statusCode).toBe(201);
    expect(res.body.message.toLowerCase()).toContain("monkey saved");
    expect(res.body.monkey).toHaveProperty("id", "M777");
  });

  it("should reject POST without token", async () => {
    const res = await request(app).post("/monkeys").send({ id: "M888" });

    expect(res.statusCode).toBe(401);
    expect(res.body.message || res.body.error).toMatch(/unauthorized/i);
  });
});
