import { createClient } from "redis";
import logger from "../utils/logger.js";

const redisClient = createClient({
  url: process.env.REDIS_URL,
  password: process.env.REDIS_PASSWORD || undefined,
  socket: {
    connectTimeout: 5000,
    reconnectStrategy: (retries) => {
      if (retries > 10) {
        logger.error("Too many Redis reconnection attempts");
        return new Error("Redis reconnection failed");
      }
      return Math.min(retries * 100, 3000);
    },
  },
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

export const redisHelpers = {
  async setEx(key, value, ttl = 3600) {
    try {
      await redisClient.setEx(key, ttl, JSON.stringify(value));
    } catch (err) {
      logger.error(`Redis SET error [${key}]: ${err.message}`);
    }
  },
  async get(key) {
    try {
      const data = await redisClient.get(key);
      return data ? JSON.parse(data) : null;
    } catch (err) {
      logger.error(`Redis GET error [${key}]: ${err.message}`);
      return null;
    }
  },
  async del(key) {
    try {
      await redisClient.del(key);
    } catch (err) {
      logger.error(`Redis DEL error [${key}]: ${err.message}`);
    }
  },
  async exists(key) {
    try {
      return await redisClient.exists(key);
    } catch (err) {
      logger.error(`Redis EXISTS error [${key}]: ${err.message}`);
      return false;
    }
  },
  async mset(keyValuePairs) {
    try {
      if (!keyValuePairs || typeof keyValuePairs !== "object") {
        throw new Error("Invalid key-value object");
      }
      const pairs = Object.entries(keyValuePairs).flat();
      await redisClient.mSet(pairs);
    } catch (err) {
      logger.error(`Redis MSET error: ${err.message}`);
    }
  },
  async blacklistToken(token, ttl) {
    try {
      await redisClient.setEx(`blacklist:${token}`, ttl, "true");
    } catch (err) {
      logger.error(`Redis BLACKLIST error: ${err.message}`);
    }
  },
  async isTokenBlacklisted(token) {
    try {
      return await redisClient.exists(`blacklist:${token}`);
    } catch (err) {
      logger.error(`Redis CHECK BLACKLIST error: ${err.message}`);
      return false;
    }
  },
};

process.on("SIGINT", async () => {
  await redisClient.quit();
  logger.info("Redis connection closed");
  process.exit(0);
});

export { redisClient, connectRedis };
