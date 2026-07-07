import mongoose from "mongoose";

const externalAccountSchema = new mongoose.Schema(
  {
    provider: { type: String, required: true }, // e.g. "oauth_google", "oauth_facebook", "oauth_x"
    providerUserId: { type: String, required: true },
    emailAddress: { type: String },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    // How this account authenticates:
    //   "local" -> username + password, we issue our own JWTs
    //   "clerk" -> signed up via Clerk (Google/Facebook/Twitter etc.), Clerk owns the session
    authProvider: {
      type: String,
      enum: ["local", "clerk"],
      required: true,
    },

    // --- Clerk identity (present only when authProvider === "clerk") ---
    clerkId: {
      type: String,
      unique: true,
      sparse: true, // lets many local docs coexist with clerkId: undefined
      index: true,
    },
    externalAccounts: [externalAccountSchema],

    // --- Local credentials (present only when authProvider === "local") ---
    password: {
      type: String,
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },

    // --- Shared profile fields ---
    username: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
      minlength: [3, "Username must be at least 3 characters"],
      maxlength: [30, "Username must be less than 30 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    imageUrl: { type: String },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    status: {
      type: String,
      enum: ["active", "suspended", "pending"],
      default: "active",
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
    },
    lastLogin: {
      type: Date,
    },
    // Bumped whenever role changes; can be used to force-expire stale JWTs
    tokenVersion: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
