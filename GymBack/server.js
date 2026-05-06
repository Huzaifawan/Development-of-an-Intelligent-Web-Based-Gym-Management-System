const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/db");
const dns = require("dns");

dns.setServers(["1.1.1.1", "8.8.8.8"]);

// Load env vars FIRST before anything else
dotenv.config();

// Validate required environment variables at startup
const requiredEnvVars = ["MONGO_URI", "JWT_SECRET"];
requiredEnvVars.forEach((varName) => {
  if (!process.env[varName]) {
    console.error(`❌ Missing required environment variable: ${varName}`);
    process.exit(1);
  }
});

if (process.env.JWT_SECRET === "your_super_secret_jwt_key_here") {
  console.warn(
    "⚠️  WARNING: You are using the default JWT_SECRET. Please change it in production!",
  );
}

// Connect to MongoDB
connectDB();

const app = express();

// ✅ Security headers
app.use(helmet());

// ✅ CORS — allows localhost:3000 and localhost:3001 (Vite auto-increments port)
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:3002",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked: ${origin}`));
      }
    },
    credentials: true,
  }),
);

// ✅ Body parser with size limit
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// ✅ NoSQL Injection sanitization
app.use(mongoSanitize());

// ✅ Rate limiting on auth routes — prevents brute force attacks
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many attempts, please try again after 15 minutes",
  },
});

// ✅ General API rate limiter — prevents API abuse
const apiLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests, please slow down" },
});

app.use("/api/auth", authLimiter);
app.use("/api", apiLimiter);

// Routes
app.use("/api/stats", require("./routes/statsRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/memberships", require("./routes/membershipRoutes"));
app.use("/api/trainers", require("./routes/trainerRoutes"));
app.use("/api/sessions", require("./routes/sessionRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/chatbot", require("./routes/chatbotRoutes"));

// Health check
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Gym Management System API is running...",
    version: "1.0.0",
  });
});

// ✅ 404 handler
app.use((req, res) => {
  res
    .status(404)
    .json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Global error handler
app.use(require("./middleware/errorHandler"));

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(
    `✅ Server running in ${process.env.NODE_ENV} mode on port ${PORT}`,
  );
});

process.on("unhandledRejection", (err) => {
  console.error(`❌ Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

process.on("uncaughtException", (err) => {
  console.error(`❌ Uncaught Exception: ${err.message}`);
  process.exit(1);
});

module.exports = app;
