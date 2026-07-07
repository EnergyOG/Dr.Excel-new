import User from "../model/user.model.js";
import clerkClient from "../config/clerk.js";

const toPublicUser = (user) => ({
  id: user._id,
  clerkId: user.clerkId,
  email: user.email,
  username: user.username,
  firstName: user.firstName,
  lastName: user.lastName,
  imageUrl: user.imageUrl,
  role: user.role,
  status: user.status,
  isEmailVerified: user.isEmailVerified,
  providers: (user.externalAccounts || []).map((a) => a.provider),
  lastLogin: user.lastLogin,
  createdAt: user.createdAt,
});

// GET /api/users/me
export const getProfile = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      data: { user: toPublicUser(req.dbUser) },
    });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/users/me
// Only fields you actually own locally should be editable here — anything
// that lives on the Clerk profile (email, name, avatar) should be changed
// through Clerk's own UI/API so the two stay consistent, then it will flow
// back in via the user.updated webhook.
export const updateProfile = async (req, res, next) => {
  try {
    const { username } = req.body;

    if (username) {
      const existing = await User.findOne({
        _id: { $ne: req.dbUser._id },
        username,
      });
      if (existing) {
        return res.status(409).json({ success: false, error: "Username already in use" });
      }
      req.dbUser.username = username;
      await req.dbUser.save();
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: { user: toPublicUser(req.dbUser) },
    });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/users/me
// Deletes the account in Clerk (source of truth) - the user.deleted
// webhook will then soft-delete the local record. We also soft-delete
// immediately for a snappy response instead of waiting on the webhook.
export const deleteOwnAccount = async (req, res, next) => {
  try {
    await clerkClient.users.deleteUser(req.dbUser.clerkId);

    req.dbUser.isDeleted = true;
    req.dbUser.deletedAt = new Date();
    await req.dbUser.save();

    res.status(200).json({ success: true, message: "Account deleted" });
  } catch (err) {
    next(err);
  }
};
