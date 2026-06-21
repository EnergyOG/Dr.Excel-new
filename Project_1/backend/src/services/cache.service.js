import { redisClient } from "../config/redis.js";

const DEFAULT_TTL = 3600;

export const setCache = async (key, value, ttl = DEFAULT_TTL) => {
  try {
    await redisClient.set(key, JSON.stringify(value), { EX: ttl });
  } catch (err) {
    console.error(`setCache [${key}]:`, err.message);
  }
};

export const getCache = async (key) => {
  try {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    console.error(`getCache [${key}]:`, err.message);
    return null;
  }
};

export const deleteCache = async (key) => {
  try {
    await redisClient.del(key);
  } catch (err) {
    console.error(`deleteCache [${key}]:`, err.message);
  }
};

export const invalidateRequestCaches = async (requestId) => {
  try {
    const keys = ["requests"];
    if (requestId) keys.push(`request:${requestId}`);
    await redisClient.del(...keys);
  } catch (err) {
    console.error(`invalidateRequestCaches:`, err.message);
  }
};