import mongoose from "mongoose";
import Request from "../models/requestModel.js";
import logger from "../utils/logger.js";
import { getCache, setCache, invalidateRequestCaches } from "../services/cacheService.js";

// Helper — avoids CastError 500s on bad ObjectId strings
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// Create Request
export const createRequest = async (req, res) => {
  try {
    const { requestName, requestEmail, requestDetails } = req.body;

    if (!requestName || !requestEmail) {
      logger.warn("Create request failed: Missing required fields");
      return res.status(400).json({ success: false, message: "Name and email are required" });
    }

    const request = await Request.create({ requestName, requestEmail, requestDetails });

    await setCache(`request:${request._id}`, request);
    await invalidateRequestCaches();

    logger.info(`Request created successfully: ${request._id}`);
    return res.status(201).json({ success: true, message: "Request submitted successfully", request });
  } catch (error) {
    logger.error(`createRequest: ${error.message}`);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get All Requests
export const getRequests = async (req, res) => {
  try {
    const cachedRequests = await getCache("requests");
    if (cachedRequests) {
      logger.info("Requests served from Redis cache");
      return res.status(200).json({ success: true, source: "cache", count: cachedRequests.length, requests: cachedRequests });
    }

    const requests = await Request.find().sort({ createdAt: -1 });
    await setCache("requests", requests);

    logger.info(`Fetched ${requests.length} requests from MongoDB`);
    return res.status(200).json({ success: true, source: "database", count: requests.length, requests });
  } catch (error) {
    logger.error(`getRequests: ${error.message}`);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get Single Request
export const getRequest = async (req, res) => {
  try {
    const { id } = req.params;

    // Guard against invalid ObjectId before hitting Mongo
    if (!isValidId(id)) {
      logger.warn(`Invalid request ID: ${id}`);
      return res.status(400).json({ success: false, message: "Invalid request ID" });
    }

    const cacheKey = `request:${id}`;
    const cachedRequest = await getCache(cacheKey);
    if (cachedRequest) {
      logger.info(`Request ${id} served from Redis cache`);
      return res.status(200).json({ success: true, source: "cache", request: cachedRequest });
    }

    const request = await Request.findById(id);
    if (!request) {
      logger.warn(`Request not found: ${id}`);
      return res.status(404).json({ success: false, message: "Request not found" });
    }

    await setCache(cacheKey, request);
    logger.info(`Request ${id} fetched from MongoDB`);
    return res.status(200).json({ success: true, source: "database", request });
  } catch (error) {
    logger.error(`getRequest (${req.params.id}): ${error.message}`);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Delete Request
export const deleteRequest = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      logger.warn(`Invalid request ID: ${id}`);
      return res.status(400).json({ success: false, message: "Invalid request ID" });
    }

    const request = await Request.findByIdAndDelete(id);
    if (!request) {
      logger.warn(`Delete failed. Request not found: ${id}`);
      return res.status(404).json({ success: false, message: "Request not found" });
    }

    await invalidateRequestCaches(id);

    logger.info(`Deleted request: ${id}`);
    return res.status(200).json({ success: true, message: "Request deleted successfully" });
  } catch (error) {
    logger.error(`deleteRequest (${req.params.id}): ${error.message}`);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Update Request Status
export const updateRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!isValidId(id)) {
      logger.warn(`Invalid request ID: ${id}`);
      return res.status(400).json({ success: false, message: "Invalid request ID" });
    }

    const request = await Request.findByIdAndUpdate(
      id,
      { requestStatus: status },
      { new: true, runValidators: true }
    );

    if (!request) {
      logger.warn(`Update failed. Request not found: ${id}`);
      return res.status(404).json({ success: false, message: "Request not found" });
    }

    await invalidateRequestCaches(id);
    await setCache(`request:${id}`, request);

    logger.info(`Request ${id} status updated to ${status}`);
    return res.status(200).json({ success: true, message: "Request status updated successfully", request });
  } catch (error) {
    logger.error(`updateRequestStatus: ${error.message}`);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};