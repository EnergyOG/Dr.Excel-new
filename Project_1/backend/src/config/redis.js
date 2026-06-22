import { createClient } from "redis";
import dotenv from "dotenv";
import logger from "../utils/logger.js";

dotenv.config();

const redisURL = process.env.REDIS_URL;
const redisPassword = process.env.REDIS_PASSWORD;

const redisClient = createClient({
  url: process.env.REDIS_URL,
  password: redisPassword,
  maxRetriesPerRequest: 3,
  socket: {
    connectTimeout: 5000,
    reconnectStrategy: (retries) => {
      if (retries > 10) {
        logger.error("Too many Redis reconnection attempts");
        return new Error("Redis reconnection failed");
      }
      return Math.min(retries * 100, 3000);
    }
  }
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
  async setEx(key, value, ttl = 3600){
    try{
      await redisClient.setEx(key, ttl, JSON.stringify(value));
    }catch(err){
      logger.error("Redis SET error", err);
    }
  },

  async get(key) {
    try{
      await redisClient.setEx(key, ttl, JSON.stringify(value));
    }catch(err){
      logger.error("Redis SET error:", err)
    }
  },

  async get(key){
    try{
      const data = await redisClient.get(key);
      return data ? JSON.parse(data) : null;
    }catch(err){
      logger.error("Redis GET error:", err);
      return null;
    }
  },

  async del(key) {
    try {
      await redisClient.del(key);
    } catch (error) {
      logger.error("Redis DEL error:", error);
    }
  },

  async exists(key) {
    try {
      return await redisClient.exists(key);
    } catch (error) {
      logger.error("Redis EXISTS error:", error);
      return false;
    }
  },

   async mset(keyValuePairs) {
    try {
      const pairs = Object.entries(keyValuePairs).flat();
      if (!keyValuePairs || typeof keyValuePairs !== "object") {
        throw new Error("Invalid key-value object");
      }
      await redisClient.mSet(pairs);
    } catch (error) {
      logger.error("Redis MSET error:", error);
    }
  },
  async blacklistToken(token, ttl) {
    try {
      await redisClient.setEx(`blacklist:${token}`, ttl, "true");
    } catch (err) {
      logger.error("Redis BLACKLIST error:", err);
    }
  },

  async isTokenBlacklisted(token) {
    try {
      return await redisClient.exists(`blacklist:${token}`);
    } catch (err) {
      logger.error("Redis CHECK BLACKLIST error:", err);
      return false;
    }
  },
};

process.on("SIGINT", async () => {
  await redisClient.quit();
  logger.log("Redis connection closed");
  process.exit(0);
});


export { redisClient, connectRedis };