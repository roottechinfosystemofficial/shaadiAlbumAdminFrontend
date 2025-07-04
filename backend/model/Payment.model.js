import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    amount: { type: Number, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    cashfree_payment_id: { type: String, unique: true, sparse: true },
    cashfree_order_id: { type: String, default: null },
    cashfree_subscription_id: { type: String, default: null },
    status: {
      type: String,
      enum: ["PENDING", "COMPLETED", "FAILED"],
      default: "PENDING",
    },
    paymentMethod: { type: String, default: "UNKNOWN" }, // ✅ add this line

    subscriptionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscription",
      default: null,
    },
  },
  { timestamps: true } // Automatically adds createdAt & updatedAt
);


export const Payment = mongoose.model("Payment", paymentSchema);
