const request = require("supertest");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

let app;

// ✅ Connect to DB before tests and disconnect after
beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  app = require("../server");
});

afterAll(async () => {
  // ✅ Clean up any test users created during tests
  await mongoose.connection.collection("users").deleteMany({
    email: { $in: ["testuser@example.com", "duplicate@example.com"] },
  });
  await mongoose.disconnect();
});

// ─── Auth: Register ───────────────────────────────────────────────
describe("POST /api/auth/register", () => {
  it("should return 400 if name is missing", async () => {
    const res = await request(app).post("/api/auth/register").send({
      email: "testuser@example.com",
      password: "test123",
    });
    expect(res.statusCode).toBeGreaterThanOrEqual(400);
    expect(res.body.success).toBe(false);
  });

  it("should return 400 if email is missing", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Test User",
      password: "test123",
    });
    expect(res.statusCode).toBeGreaterThanOrEqual(400);
    expect(res.body.success).toBe(false);
  });

  it("should return 400 if password is missing", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Test User",
      email: "testuser@example.com",
    });
    expect(res.statusCode).toBeGreaterThanOrEqual(400);
    expect(res.body.success).toBe(false);
  });

  it("should register successfully with valid data", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Test User",
      email: "testuser@example.com",
      password: "test123",
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.role).toBe("member"); // ✅ Role must default to member
  });

  it("should return 400 if email already exists", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Duplicate User",
      email: "testuser@example.com", // already registered above
      password: "test123",
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("should NOT allow role to be set via request body", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Hacker",
      email: "duplicate@example.com",
      password: "hacker123",
      role: "admin", // ✅ This must be ignored
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.user.role).toBe("member"); // ✅ Must still be member
  });
});

// ─── Auth: Login ─────────────────────────────────────────────────
describe("POST /api/auth/login", () => {
  it("should return 400 if both fields are missing", async () => {
    const res = await request(app).post("/api/auth/login").send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("should return 400 if password is missing", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "testuser@example.com" });
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("should return 401 for wrong credentials", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "testuser@example.com",
      password: "wrongpassword",
    });
    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it("should login successfully with correct credentials", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "testuser@example.com",
      password: "test123",
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
  });
});

// ─── Auth: Get Me ─────────────────────────────────────────────────
describe("GET /api/auth/me", () => {
  it("should return 401 if no token is provided", async () => {
    const res = await request(app).get("/api/auth/me");
    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it("should return 401 for invalid token", async () => {
    const res = await request(app)
      .get("/api/auth/me")
      .set("Authorization", "Bearer invalidtoken123");
    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it("should return user profile with valid token", async () => {
    // First login to get a token
    const loginRes = await request(app).post("/api/auth/login").send({
      email: "testuser@example.com",
      password: "test123",
    });
    const token = loginRes.body.token;

    const res = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.user.email).toBe("testuser@example.com");
  });
});

// ─── 404 Handler ─────────────────────────────────────────────────
describe("Unknown routes", () => {
  it("should return 404 for undefined routes", async () => {
    const res = await request(app).get("/api/nonexistent");
    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
  });
});
