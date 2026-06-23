import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import { redisClient } from "../config/redis.js";

const makeStore = (prefix) =>
  new RedisStore({
    sendCommand: (...args) => redisClient.sendCommand(args),
    prefix,
  });

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: {
    success: false,
    error: "Too many requests. Please try again later.",
    retryAfter: "15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  store: makeStore("auth_limit:"),
});

export const strictAuthLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    error: "Too many authentication attempts. Please try again later.",
    retryAfter: "15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  store: makeStore("strict_auth_limit:"),
});