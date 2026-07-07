import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { clerkMiddleware } from "@clerk/express";

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
    const { default: webhookRoutes } = await import("./src/routes/webhook.route.js");
    const { default: requestRoutes } = await import("./src/routes/request.route.js");
    const { default: authRoutes } = await import("./src/routes/auth.route.js");
    const { default: adminRoutes } = await import("./src/routes/admin.route.js");
    const { default: userRoutes } = await import("./src/routes/user.route.js");

    // IMPORTANT: mounted BEFORE express.json(). Clerk's webhook signature
    // check needs the raw, untouched request body — webhook.route.js applies
    // express.raw() itself for this path. If express.json() ran first (as it
    // did in the original server.js), the body would already be parsed/
    // consumed and every webhook delivery would fail signature verification.
    app.use("/api/webhooks", webhookRoutes);

    // Body parsers for everything else
    app.use(express.json({ limit: "10mb" }));
    app.use(express.urlencoded({ extended: true, limit: "10mb" }));

    // Populates req.auth()/getAuth(req) from a Clerk session, if one is
    // present. Safe to apply globally — it does not block or error on
    // requests that have no Clerk session (e.g. your local JWT routes).
    app.use(clerkMiddleware());

    // Routes
    app.use("/api/requests", requestRoutes);
    app.use("/api/auth", authRoutes);
    app.use("/api/admin", adminRoutes);
    app.use("/api/users", userRoutes);

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