import express from "express";
import {
  createRequest,
  getRequests,
  getRequest,
  deleteRequest,
  updateRequestStatus,
} from "../controllers/request.controller.js";
import { identify, requireAdmin } from "../middleware/adminGuard.js";

const router = express.Router();

// Public: anyone can submit a request (e.g. a contact/support form)
router.post("/", createRequest);

// SECURITY FIX: these were previously mounted with no auth at all, meaning
// any unauthenticated caller could list, read, update, or delete every
// request in the system. They're staff-only now.
router.get("/", identify, requireAdmin, getRequests);
router.get("/:id", identify, requireAdmin, getRequest);
router.patch("/:id/status", identify, requireAdmin, updateRequestStatus);
router.delete("/:id", identify, requireAdmin, deleteRequest);

export default router;
