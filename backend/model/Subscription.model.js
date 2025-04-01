import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    planId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plan",
      required: true,
    },
    type: {
      type: String,
      enum: ["BUY", "COUPON"],
      required: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "ACTIVE", "EXPIRED", "CANCELLED"],
      default: "PENDING",
    },
    amount: { type: Number, required: true },
    startDate: { type: Date, default: null },
    endDate: { type: Date, default: null },
    cashfree_subscription_id: { type: String, default: null },
    cashfree_order_id: { type: String, default: null },
    subscription_id: { type: String, default: null },
    order_id: { type: String, default: null },
    subscription_first_charge_time: { type: Date, default: null },
    session_id: { type: String, default: null },
    first_payment_id: { type: String, default: null },
    isRecurring: { type: Boolean, default: false },
  },
  { timestamps: true } // Automatically adds createdAt & updatedAt
);


module.exports = mongoose.model("Subscription", subscriptionSchema);
