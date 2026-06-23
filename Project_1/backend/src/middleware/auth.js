import { verifyAccessToken } from "../config/jwt.js";
import { redisHelpers } from "../config/redis.js";

export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        error: "No token provided. Authentication required.",
      });
    }

    const token = authHeader.split(" ")[1];

    const isBlacklisted = await redisHelpers.exists(`blacklist:${token}`);
    if (isBlacklisted) {
      return res.status(401).json({
        success: false,
        error: "Token is invalid. Please login again.",
      });
    }

    const decoded = verifyAccessToken(token);

    req.user = {
      id: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error) {
    if (error.message.includes("expired")) {
      return res.status(401).json({
        success: false,
        error: "Token expired. Please refresh your token or login again.",
      });
    }

    return res.status(401).json({
      success: false,
      error: "Invalid token. Authentication failed.",
    });
  }
};

export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      const decoded = verifyAccessToken(token);
      req.user = {
        id: decoded.userId,
        email: decoded.email,
        role: decoded.role,
      };
    }
  } catch (error) {
    // Silently fail — request continues without user
  }

  next();
};

export const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      error: "Access denied. Admin only.",
    });
  }
  next();
};