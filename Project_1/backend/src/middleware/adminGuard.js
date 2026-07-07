import { getAuth } from "@clerk/express";
import { verifyAccessToken } from "../config/jwt.js";
import { redisHelpers } from "../config/redis.js";
import clerkClient from "../config/clerk.js";
import User from "../model/user.model.js";
import { upsertUserFromClerk } from "../services/userSync.service.js";

/**
 * Because you have two ways to log in (our own JWT, or a Clerk session),
 * /api/admin/* needs to recognize an admin no matter which one they used.
 * This tries the JWT first (Authorization: Bearer <token>), then falls back
 * to a Clerk session (populated by the global clerkMiddleware() in server.js).
 * Either way, req.currentUser ends up as the same unified User document.
 */
export const identify = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];

      const isBlacklisted = await redisHelpers.isTokenBlacklisted(token);
      if (isBlacklisted) {
        return res.status(401).json({ success: false, error: "Token is invalid. Please login again." });
      }

      const decoded = verifyAccessToken(token);
      const user = await User.findById(decoded.userId);

      if (!user || user.isDeleted) {
        return res.status(401).json({ success: false, error: "User not found" });
      }

      req.currentUser = user;
      req.authType = "local";
      return next();
    }

    const { userId: clerkId } = getAuth(req);
    if (clerkId) {
      let user = await User.findOne({ clerkId });

      if (!user) {
        const clerkUser = await clerkClient.users.getUser(clerkId);
        user = await upsertUserFromClerk(clerkUser);
      }

      if (!user || user.isDeleted) {
        return res.status(401).json({ success: false, error: "User not found" });
      }

      req.currentUser = user;
      req.authType = "clerk";
      return next();
    }

    return res.status(401).json({ success: false, error: "Authentication required" });
  } catch (error) {
    if (error.message && error.message.includes("expired")) {
      return res.status(401).json({
        success: false,
        error: "Token expired. Please refresh your token or login again.",
      });
    }
    return res.status(401).json({ success: false, error: "Invalid or missing credentials" });
  }
};

export const requireAdmin = (req, res, next) => {
  if (!req.currentUser || req.currentUser.role !== "admin") {
    return res.status(403).json({ success: false, error: "Access denied. Admin only." });
  }
  next();
};
