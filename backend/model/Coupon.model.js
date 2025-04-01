import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: { type: String, unique: true, required: true },
    action: {
      type: String,
      enum: ["E_ALBUM", "VIDEOBOOK"],
      required: true,
    },
    expiry: { type: Date, required: true },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true } // Automatically adds createdAt & updatedAt
);

module.exports = mongoose.model("Coupon", couponSchema);
