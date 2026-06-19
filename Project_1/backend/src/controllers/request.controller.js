import Request from "../models/requestModel.js";
import logger from "../utils/logger.js";

// Create Request
export const createRequest = async (req, res) => {
  try {
    const { requestName, requestEmail, requestDetails } = req.body;

    if (!requestName || !requestEmail) {
      logger.warn("Create request failed: Missing required fields");

      return res.status(400).json({
        success: false,
        message: "Name and email are required",
      });
    }

    const request = await Request.create({
      requestName,
      requestEmail,
      requestDetails,
    });

    logger.info(`Request created successfully: ${request._id}`);

    res.status(201).json({
      success: true,
      message: "Request submitted successfully",
      request,
    });
  } catch (error) {
    logger.error(`createRequest: ${error.message}`);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get All Requests
export const getRequests = async (req, res) => {
  try {
    const requests = await Request.find().sort({ createdAt: -1 });

    logger.info(`Fetched ${requests.length} requests`);

    res.status(200).json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (error) {
    logger.error(`getRequests: ${error.message}`);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get Single Request
export const getRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await Request.findById(id);

    if (!request) {
      logger.warn(`Request not found: ${id}`);

      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    logger.info(`Fetched request: ${id}`);

    res.status(200).json({
      success: true,
      request,
    });
  } catch (error) {
    logger.error(
      `getRequest (${req.params.id}): ${error.message}`
    );

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Delete Request
export const deleteRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await Request.findByIdAndDelete(id);

    if (!request) {
      logger.warn(`Delete failed. Request not found: ${id}`);

      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    logger.info(`Deleted request: ${id}`);

    res.status(200).json({
      success: true,
      message: "Request deleted successfully",
    });
  } catch (error) {
    logger.error(
      `deleteRequest (${req.params.id}): ${error.message}`
    );

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Update Status
export const updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const request = await Request.findByIdAndUpdate(
      req.params.id,
      { requestStatus: status },
      { new: true, runValidators: true }
    );

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    res.status(200).json({
      success: true,
      request,
    });
  } catch (error) {
    logger.error(`updateRequestStatus: ${error.message}`);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};