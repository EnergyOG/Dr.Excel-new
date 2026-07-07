import express from "express";
import {
  adminGetAllUsers,
  adminGetUser,
  changeUserRole,
  updateUserStatus,
  forceLogoutUser,
  softDeleteUser,
  adminGetAllRequests,
  adminGetRequest,
  adminDeleteRequest,
  getAdminStats,
} from "../controllers/admin.controller.js";
import { identify, requireAdmin } from "../middleware/adminGuard.js";

const router = express.Router();

// All admin routes require authentication (either local JWT or Clerk
// session) and the "admin" role on the unified User document.
router.use(identify, requireAdmin);

// Dashboard stats
router.get("/stats", getAdminStats);

// User management (works for both local and Clerk-synced accounts)
router.get("/users", adminGetAllUsers);
router.get("/users/:userId", adminGetUser);
router.patch("/users/:userId/role", changeUserRole);
router.patch("/users/:userId/status", updateUserStatus);
router.post("/users/:userId/force-logout", forceLogoutUser);
router.delete("/users/:userId", softDeleteUser);

// Request management
router.get("/requests", adminGetAllRequests);
router.get("/requests/:requestId", adminGetRequest);
router.delete("/requests/:requestId", adminDeleteRequest);

export default router;
