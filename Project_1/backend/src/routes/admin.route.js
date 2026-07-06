import express from "express";
import {
  adminGetAllUsers,
  adminGetUser,
  adminGetAllRequests,
  adminGetRequest,
  adminDeleteRequest,
  getAdminStats,
} from "../controllers/admin.controller.js";
import { requireAdmin, verifyToken } from "../middleware/auth.js";

const router = express.Router();

// All admin routes require authentication and admin role
router.use(verifyToken, requireAdmin);

// Dashboard stats
router.get("/stats", getAdminStats);

// User management
router.get("/users", adminGetAllUsers);
router.get("/users/:userId", adminGetUser);

// Request management
router.get("/requests", adminGetAllRequests);
router.get("/requests/:requestId", adminGetRequest);
router.delete("/requests/:requestId", adminDeleteRequest);

export default router;
