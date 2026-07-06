import User from "../model/auth.model.js";
import Request from "../model/request.model.js";
import logger from "../utils/logger.js";

// Get all users with pagination and filtering
export const adminGetAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search = "", status, role } = req.query;
    
    const query = { isDeleted: false };
    
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }
    
    if (status) {
      query.status = status;
    }
    
    if (role) {
      query.role = role;
    }
    
    const users = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    
    const total = await User.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: users.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: users,
    });
  } catch (err) {
    next(err);
  }
};

// Get user by ID
export const adminGetUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId).select("-password");
    
    if (!user || user.isDeleted) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }
    
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

// Get all requests with pagination and filtering
export const adminGetAllRequests = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search = "", status } = req.query;
    
    const query = {};
    
    if (search) {
      query.$or = [
        { requestName: { $regex: search, $options: "i" } },
        { requestEmail: { $regex: search, $options: "i" } },
        { requestDetails: { $regex: search, $options: "i" } },
      ];
    }
    
    if (status) {
      query.requestStatus = status;
    }
    
    const requests = await Request.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    
    const total = await Request.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: requests.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: requests,
    });
  } catch (err) {
    next(err);
  }
};

// Get request by ID
export const adminGetRequest = async (req, res, next) => {
  try {
    const { requestId } = req.params;
    
    const request = await Request.findById(requestId);
    
    if (!request) {
      return res.status(404).json({
        success: false,
        error: "Request not found",
      });
    }
    
    res.status(200).json({
      success: true,
      data: request,
    });
  } catch (err) {
    next(err);
  }
};

// Delete request (admin)
export const adminDeleteRequest = async (req, res, next) => {
  try {
    const { requestId } = req.params;
    
    const request = await Request.findByIdAndDelete(requestId);
    
    if (!request) {
      return res.status(404).json({
        success: false,
        error: "Request not found",
      });
    }
    
    logger.info(`Admin deleted request: ${requestId}`);
    
    res.status(200).json({
      success: true,
      message: "Request deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

// Get dashboard statistics
export const getAdminStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments({ isDeleted: false });
    const totalAdmins = await User.countDocuments({ role: "admin", isDeleted: false });
    const totalRequests = await Request.countDocuments();
    const pendingRequests = await Request.countDocuments({ requestStatus: "pending" });
    const backlogRequests = await Request.countDocuments({ requestStatus: "backlog" });
    const doneRequests = await Request.countDocuments({ requestStatus: "done" });
    const suspendedUsers = await User.countDocuments({ status: "suspended", isDeleted: false });
    
    res.status(200).json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          admins: totalAdmins,
          suspended: suspendedUsers,
        },
        requests: {
          total: totalRequests,
          pending: pendingRequests,
          backlog: backlogRequests,
          done: doneRequests,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};
