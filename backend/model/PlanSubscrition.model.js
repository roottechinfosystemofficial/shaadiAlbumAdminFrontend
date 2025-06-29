// models/PlanSubscription.js
import mongoose from "mongoose";

const planSubscriptionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    planName:{type: String,
      enum: ["Plan 1", "Plan 2", "Plan 3","Plan 4","Plan 5"],
      default: "Plan1",
    },
    price: { type: String, required: true },

    storageLimitGB: { type: Number, required: true }, // In GB
    faceRecognitionLimit: { type: Number }, // Use `null` or large value for Unlimited,
    usedStorageInBytes: { type: Number, default: 0 }, // Track actual usage
    faceRecognitionsUsed: { type: Number, default: 0 }, // Increment on each recognition

    qrDesignLimit: { type: String, default: "Unlimited" },
    eAlbumLimit: { type: String, default: "Unlimited" },
    crmAccess: { type: Boolean, default: false },
    watermarkAccess: { type: Boolean, default: false },
    albumPhotoSelection: { type: Boolean, default: false },
    imageDownloadControl: { type: Boolean, default: false },


    startDate: { type: Date, default: Date.now },
    endDate: { type: Date, required: true },

    isActive: { type: Boolean, default: true },

}, {
    timestamps: true,
});

export const PlanSubscription = mongoose.model("PlanSubscription", planSubscriptionSchema);
