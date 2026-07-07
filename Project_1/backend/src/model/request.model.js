import mongoose from "mongoose";

const requestSchema = new mongoose.Schema(
  {
    requestName: {
      type: String,
      required: true,
    },
    requestEmail: {
      type: String,
      required: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    requestDetails: {
      type: String,
      trim: true,
    },
    requestStatus: {
      type: String,
      enum: ["backlog", "pending", "done"],
      default: "backlog",
    },
  },
  {
    timestamps: true,
  }
);

const Request = mongoose.model("Request", requestSchema);
export default Request;
