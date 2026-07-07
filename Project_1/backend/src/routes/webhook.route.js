import { Router } from "express";
import express from "express";
import { handleClerkWebhook } from "../controllers/webhook.controller.js";

const router = Router();

// `express.raw` is required here (not express.json) so verifyWebhook can
// check the Svix signature against the untouched request body.
router.post(
  "/clerk",
  express.raw({ type: "application/json" }),
  handleClerkWebhook
);

export default router;
