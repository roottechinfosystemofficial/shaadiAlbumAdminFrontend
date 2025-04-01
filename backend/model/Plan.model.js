import mongoose from "mongoose";

const planSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    features: { type: [String], default: [] },
    type: {
      type: String,
      enum: ["BASIC", "PRO", "ADVANCE"],
      required: true,
    },
    isPopular: { type: Boolean, default: false },
    cashfree_plan_id: { type: String, default: null },
    duration: { type: Number, default: 0 }, // Duration in days (0 means unlimited)
    price: { type: Number, required: true },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE", "ARCHIVED"],
      default: "ACTIVE",
    },
  },
  { timestamps: true } // Automatically adds createdAt & updatedAt
);



module.exports = mongoose.model("Plan", planSchema);
