import User from "../model/user.model.js";
import Request from "../model/request.model.js";
import { redisHelpers } from "../config/redis.js";
import clerkClient from "../config/clerk.js";
import { sendAccountDeletionEmail } from "../services/email.service.js";
import logger from "../utils/logger.js";

// Clerk doesn't have a single "revoke by userId" call - a user can have
// multiple active sessions, so we list and revoke each one.
async function revokeClerkSessions(clerkId) {
  const { data: sessions } = await clerkClient.sessions.getSessionList({
    userId: clerkId,
    status: "active",
  });

  await Promise.all(
    sessions.map((session) => clerkClient.sessions.revokeSession(session.id))
  );
}

// Get all users with pagination and filtering (both local and Clerk accounts)
export const adminGetAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search = "", status, role, authProvider } = req.query;

    const query = { isDeleted: false };

    if (search) {
      query.$or = [
        { username: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    if (status) query.status = status;
    if (role) query.role = role;
    if (authProvider) query.authProvider = authProvider;

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

export const changeUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;

    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({
        success: false,
        error: "Invalid role",
      });
    }

    const user = await User.findById(req.params.userId);
    if (!user || user.isDeleted) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    if (user.email === process.env.SUPER_ADMIN_EMAIL) {
      return res.status(403).json({
        success: false,
        error: "Super admin role cannot be changed",
      });
    }

    user.role = role;
    user.tokenVersion += 1;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User role updated to ${role}`,
    });
  } catch (err) {
    next(err);
  }
};

export const updateUserStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const { userId } = req.params;

    if (!["active", "suspended"].includes(status)) {
      return res.status(400).json({
        success: false,
        error: "Invalid status",
      });
    }

    const user = await User.findById(userId);
    if (!user || user.isDeleted) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    if (user.email === process.env.SUPER_ADMIN_EMAIL) {
      return res.status(403).json({
        success: false,
        error: "Super admin status cannot be changed",
      });
    }

    user.status = status;
    await user.save();

    // Force logout if suspended — route to the right system for this account
    if (status === "suspended") {
      if (user.authProvider === "local") {
        await redisHelpers.del(`refresh_token:${userId}`);
        await redisHelpers.del(`user:${userId}`);
      } else if (user.authProvider === "clerk" && user.clerkId) {
        try {
          await revokeClerkSessions(user.clerkId);
        } catch (e) {
          logger.error(`Could not revoke Clerk sessions for ${user.clerkId}: ${e.message}`);
        }
      }
    }

    res.status(200).json({
      success: true,
      message: `User ${status} successfully`,
    });
  } catch (err) {
    next(err);
  }
};

export const forceLogoutUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    if (user.authProvider === "local") {
      await redisHelpers.del(`refresh_token:${userId}`);
      await redisHelpers.del(`user:${userId}`);
    } else if (user.authProvider === "clerk" && user.clerkId) {
      await revokeClerkSessions(user.clerkId);
    }

    res.status(200).json({
      success: true,
      message: "User logged out from all sessions",
    });
  } catch (err) {
    next(err);
  }
};

export const softDeleteUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (req.currentUser._id.toString() === userId) {
      return res.status(400).json({
        success: false,
        error: "You cannot delete your own account",
      });
    }

    const user = await User.findById(userId);
    if (!user || user.isDeleted) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    if (user.email === process.env.SUPER_ADMIN_EMAIL) {
      return res.status(403).json({
        success: false,
        error: "Super admin account cannot be deleted",
      });
    }

    user.isDeleted = true;
    user.deletedAt = new Date();
    await user.save();

    if (user.authProvider === "local") {
      await redisHelpers.del(`refresh_token:${userId}`);
    } else if (user.authProvider === "clerk" && user.clerkId) {
      try {
        await clerkClient.users.deleteUser(user.clerkId);
      } catch (e) {
        logger.error(`Could not delete Clerk user ${user.clerkId}: ${e.message}`);
      }
    }

    try {
      await sendAccountDeletionEmail(user.email, user.username || user.firstName || "there");
    } catch (e) {
      logger.error(`Deletion email failed: ${e.message}`);
    }

    logger.info(`SOFT_DELETE_USER - actor: ${req.currentUser._id}, target: ${userId}`);

    res.status(200).json({
      success: true,
      message: "User account has been deactivated",
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
    const localUsers = await User.countDocuments({ authProvider: "local", isDeleted: false });
    const clerkUsers = await User.countDocuments({ authProvider: "clerk", isDeleted: false });
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
          local: localUsers,
          clerk: clerkUsers,
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
