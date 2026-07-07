import { redisClient } from "../config/redis.js";
import logger from "../utils/logger.js";

const DEFAULT_TTL = 3600;

export const setCache = async (key, value, ttl = DEFAULT_TTL) => {
  try {
    await redisClient.set(key, JSON.stringify(value), { EX: ttl });
  } catch (err) {
    logger.error(`setCache [${key}]: ${err.message}`);
  }
};

export const getCache = async (key) => {
  try {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    logger.error(`getCache [${key}]: ${err.message}`);
    return null;
  }
};

export const deleteCache = async (key) => {
  try {
    await redisClient.del(key);
  } catch (err) {
    logger.error(`deleteCache [${key}]: ${err.message}`);
  }
};

export const invalidateRequestCaches = async (requestId) => {
  try {
    const keys = ["requests"];
    if (requestId) keys.push(`request:${requestId}`);
    await redisClient.del(...keys);
  } catch (err) {
    logger.error(`invalidateRequestCaches: ${err.message}`);
  }
};
