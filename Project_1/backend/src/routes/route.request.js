import express from "express";
import {
  createRequest,
  getRequests,
  getRequest,
  deleteRequest,
  updateRequestStatus,
} from "../controllers/request.controller.js";

const router = express.Router();

router.post("/", createRequest);
router.get("/", getRequests);
router.get("/:id", getRequest);
router.delete("/:id", deleteRequest);
router.patch("/:id/status", updateRequestStatus);

export default router;