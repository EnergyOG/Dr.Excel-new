import express from "express";
import {
  createRequest,
  getRequests,
  getRequest,
  deleteRequest,
} from "../controllers/requestController.js";

const router = express.Router();

router.post("/", createRequest);
router.get("/", getRequests);
router.get("/:id", getRequest);
router.delete("/:id", deleteRequest);

export default router;