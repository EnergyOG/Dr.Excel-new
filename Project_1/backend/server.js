import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import connectDB from "./src/config/database.js";
import { connectRedis } from "./src/config/redis.js";
import requestRoutes from "./src/routes/request.route.js";
import {notFound, errorHandler} from "./src/middleware/errorHandler.js";
import authRoutes from "./src/routes/auth.route.js"
import cookieParser from "cookie-parser"
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

app.use(helmet());

app.use(cors({
  origin: `http:localhost:${PORT}`,
  credentials: true
}))

app.use(cookieParser());
app.use(express.json({limit: '10mb'}));
app.use(express.urlencoded({extended: true, limit: '10mb'}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/requests", requestRoutes);
app.use("/api/auth", authRoutes);


// Health Check
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is running",
  });
});

// 404 Handler
app.use("*", (req, res) => {
  logger.warn(`Route not found: ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Global error handler
app.use((err, req, res, next) => {
  logger.error(`Unhandled error: ${err.message}`);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

const startServer = async () => {
  try {
    await connectDB();
    await connectRedis();

    const PORT = process.env.PORT || 5000;

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