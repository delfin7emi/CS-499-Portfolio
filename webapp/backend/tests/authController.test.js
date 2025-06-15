// Load environment variables from .env, .env.development, etc.
require('dotenv-flow').config();

// Required modules for testing
const request = require('supertest');        // Makes HTTP requests to the server
const jwt = require('jsonwebtoken');         // Decodes JWT to verify payload
const fs = require('fs');                    // For reading/writing test users
const path = require('path');
const { app, server } = require('../server'); // Your Express app and server instance

// Load secret and file path for test user handling
const JWT_SECRET = process.env.JWT_SECRET;
const usersFile = path.join(__dirname, '../users.json');

// Dummy credentials for testing
const TEST_USER = 'testuser123';
const TEST_PASS = 'TestPass123!';

describe('Authentication Controller', () => {

  //  Clean up any leftover test user before tests start
  beforeAll(() => {
    if (fs.existsSync(usersFile)) {
      const users = JSON.parse(fs.readFileSync(usersFile, 'utf-8'));
      if (users[TEST_USER]) {
        delete users[TEST_USER];
        fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
      }
    }
  });

  //  Gracefully shut down the server after all tests
  afterAll((done) => {
    if (server && typeof server.close === 'function') {
      server.close(done);
    } else {
      done(); // fallback if server is undefined
    }
  });

  //  Register a new user
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ username: TEST_USER, password: TEST_PASS });

    expect(res.statusCode).toBe(201);
    expect(res.body.message.toLowerCase()).toContain('registered');
  });

  //  Reject weak or malformed input
  it('should reject weak or invalid input', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ username: 'a!', password: '123' }); // too short + weak

    expect(res.statusCode).toBe(400);
    expect(res.body.message.toLowerCase()).toMatch(/invalid|weak/i);
  });

  //  Log in and validate token
  it('should login and return a valid JWT token', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ username: TEST_USER, password: TEST_PASS });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(typeof res.body.token).toBe('string');

    //  Decode token and confirm payload
    const decoded = jwt.verify(res.body.token, JWT_SECRET);
    expect(decoded.username).toBe(TEST_USER);
    console.log(' Token returned:', res.body.token);
  });

});
