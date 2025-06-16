require("module-alias/register");

jest.setTimeout(100000);

const request = require("supertest");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

//  Fixed import paths
const { app, server } = require("@server");
const Dog = require("@models/Dogs");
const validateDog = require("@middleware/validateDog");

const token = jwt.sign(
  { username: "testuser" },
  process.env.JWT_SECRET || "secret123",
  { expiresIn: "1h" }
);

beforeAll(async () => {
  await mongoose.connect("mongodb://127.0.0.1:27017/grazioso_test", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log(" Connected to test database (grazioso_test)");
});

afterAll(async () => {
  await Dog.deleteMany({ id: { $in: ["D123", "D124", "D_DUP", "D_BAD"] } });
  await mongoose.connection.close();
  if (server && typeof server.close === "function") await server.close();
});

describe("POST /dogs", () => {
  it("should successfully create a dog", async () => {
    const newDog = {
      id: "D123",
      name: "TestDog",
      breed: "German Shepherd",
      gender: "Male",
      age: 4,
      weight: 65,
      acquisitionDate: "2025-06-14",
      acquisitionLocation: "Texas",
      trainingStatus: "In Training",
      reserved: false,
      inServiceCountry: "US"
    };

    const res = await request(app)
      .post("/dogs")
      .set("Authorization", `Bearer ${token}`)
      .send(newDog);

    console.log(res.body);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("message", "Dog created");
    expect(res.body.dog).toHaveProperty("id", "D123");
  });

  it("should reject POST without auth token", async () => {
    const res = await request(app)
      .post("/dogs")
      .send({ id: "D124", name: "UnauthorizedDog", breed: "Labrador" });

    expect(res.statusCode).toBe(401);
    expect(res.body.message || res.body.error).toMatch(/unauthorized/i);
  });

  it("should return 400 if required fields are missing", async () => {
    const res = await request(app)
      .post("/dogs")
      .set("Authorization", `Bearer ${token}`)
      .send({ id: "D_BAD", name: "IncompleteDog" });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/missing/i);
  });

  it("should return 400 for invalid gender or trainingStatus", async () => {
    const res = await request(app)
      .post("/dogs")
      .set("Authorization", `Bearer ${token}`)
      .send({
        id: "D_BAD",
        name: "InvalidDog",
        breed: "Mutt",
        gender: "Robot",
        age: 3,
        weight: 50,
        acquisitionDate: "2025-01-01",
        acquisitionLocation: "Oregon",
        trainingStatus: "Idle",
        reserved: false,
        inServiceCountry: "US"
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/invalid/i);
  });

  it("should reject negative age/weight", async () => {
    const res = await request(app)
      .post("/dogs")
      .set("Authorization", `Bearer ${token}`)
      .send({
        id: "D_BAD",
        name: "NegDog",
        breed: "Pitbull",
        gender: "Female",
        age: -2,
        weight: -45,
        acquisitionDate: "2025-01-01",
        acquisitionLocation: "Nevada",
        trainingStatus: "Available",
        reserved: false,
        inServiceCountry: "US"
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/invalid/i);
  });

  it("should reject duplicate dog ID", async () => {
    const dogData = {
      id: "D_DUP",
      name: "OriginalDog",
      breed: "Husky",
      gender: "Male",
      age: 5,
      weight: 70,
      acquisitionDate: "2025-06-14",
      acquisitionLocation: "Colorado",
      trainingStatus: "Available",
      reserved: false,
      inServiceCountry: "US"
    };

    await request(app)
      .post("/dogs")
      .set("Authorization", `Bearer ${token}`)
      .send(dogData);

    const res = await request(app)
      .post("/dogs")
      .set("Authorization", `Bearer ${token}`)
      .send(dogData);

    expect(res.statusCode).toBe(409);
    expect(res.body.error || res.body.message).toMatch(/duplicate/i);
  });
});
