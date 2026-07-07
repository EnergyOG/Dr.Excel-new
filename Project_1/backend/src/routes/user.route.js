import express from "express";
import { requireAuth } from "@clerk/express";
import { getProfile, updateProfile, deleteOwnAccount } from "../controllers/user.controller.js";
import { attachDbUser } from "../middleware/auth.middleware.js";

const router = express.Router();

// clerkMiddleware() is mounted globally in server.js; requireAuth() enforces
// that a valid Clerk session exists, then attachDbUser loads/syncs the
// local copy of the user (used by google/facebook/twitter sign-ins).
router.use(requireAuth(), attachDbUser);

router.get("/me", getProfile);
router.patch("/me", updateProfile);
router.delete("/me", deleteOwnAccount);

export default router;
