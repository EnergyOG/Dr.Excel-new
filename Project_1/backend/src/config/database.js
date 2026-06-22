import mongoose from "mongoose";
import logger from "../utils/logger.js";
import dotenv from "dotenv";

dotenv.config();

const mongoURI = process.env.MONGODB_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    logger.log(`Successfully connected to database on ${conn.connection.host}`);

    mongoose.connection.on("error", (err) => {
      logger.error("MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", (err) => {
      logger.log("MongoDB disconnected");
    });

    mongoose.connection.on;

    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      logger.log("MongoDB connection closed due to app termination");
      process.exit(0);
    });
  } catch (error) {
    logger.error(`MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;