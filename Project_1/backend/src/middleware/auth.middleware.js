import { getAuth } from "@clerk/express";
import clerkClient from "../config/clerk.js";
import User from "../model/user.model.js";
import { cacheUser, upsertUserFromClerk } from "../services/userSync.service.js";
import logger from "../utils/logger.js";

/**
 * Requires a valid Clerk session (mount `clerkMiddleware()` globally in
 * server.js first, then `requireAuth()` from @clerk/express on the router,
 * then this middleware to load *our* Mongo copy of the user).
 *
 * Also acts as a safety net: if the `user.created` webhook hasn't landed yet
 * (delivery lag, dropped event, first-ever sign-in on a fresh DB) we lazily
 * fetch the user from Clerk's API and upsert them, so requests never fail
 * just because the webhook is late.
 */
export const attachDbUser = async (req, res, next) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    let dbUser = await User.findOne({ clerkId: userId });
    if (!dbUser) {
      const clerkUser = await clerkClient.users.getUser(userId);
      dbUser = await upsertUserFromClerk(clerkUser);
      logger.info(`Lazy-synced user from Clerk on first request - clerkId: ${userId}`);
    }

    if (dbUser.isDeleted) {
      return res.status(404).json({ success: false, error: "User not found" });
    }
    if (dbUser.status === "suspended") {
      return res.status(403).json({ success: false, error: "Account suspended" });
    }

    dbUser.lastLogin = new Date();
    await dbUser.save();
    await cacheUser(dbUser);

    req.dbUser = dbUser;
    next();
  } catch (err) {
    next(err);
  }
};

export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.dbUser || !roles.includes(req.dbUser.role)) {
      return res.status(403).json({ success: false, error: "Forbidden" });
    }
    next();
  };
};

export const requireAdmin = requireRole("admin");
