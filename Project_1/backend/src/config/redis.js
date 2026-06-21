import { createClient } from "redis";
import logger from "../utils/logger.js";

const redisClient = createClient({
  url: process.env.REDIS_URL,
});

redisClient.on("connect", () => {
  logger.info("Redis connected successfully");
});

redisClient.on("error", (error) => {
  logger.error(`Redis connection error: ${error.message}`);
});

const connectRedis = async () => {
  try {
    await redisClient.connect();
  } catch (error) {
    logger.error(`Failed to connect Redis: ${error.message}`);
    process.exit(1);
  }
};

export { redisClient, connectRedis };