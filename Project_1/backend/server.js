import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import connectDB from "./src/config/database.js";
import { connectRedis } from "./src/config/redis.js";
import { notFound, errorHandler } from "./src/middleware/errorHandler.js";
import logger from "./src/utils/logger.js";

dotenv.config();

// Register process handlers first — before any async code runs
process.on("uncaughtException", (error) => {
  logger.error(`Uncaught Exception: ${error.message}`);
  process.exit(1);
});

process.on("unhandledRejection", (error) => {
  logger.error(`Unhandled Rejection: ${error.message}`);
  process.exit(1);
});

const app = express();
const PORT = process.env.PORT || 5000;

// Core middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || `http://localhost:${PORT}`,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Health check — registered before startServer so it works even if DB/Redis fail
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is running",
  });
});

const startServer = async () => {
  try {
    // Connect to DB and Redis FIRST before importing anything that uses them
    await connectDB();
    await connectRedis();

    // Dynamically import routes AFTER connections are live
    // This prevents rateLimiter.js from initialising its RedisStore before Redis is connected
    const { default: requestRoutes } = await import("./src/routes/request.route.js");
    const { default: authRoutes } = await import("./src/routes/auth.route.js");

    // Routes
    app.use("/api/requests", requestRoutes);
    app.use("/api/auth", authRoutes);

    // Error handlers — must come after routes
    app.use(notFound);
    app.use(errorHandler);

    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  } catch (error) {
    logger.error(`Server startup failed: ${error.message}`);
    process.exit(1);
  }
};

startServer();