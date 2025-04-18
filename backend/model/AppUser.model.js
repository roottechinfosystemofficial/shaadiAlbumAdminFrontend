import mongoose from "mongoose";

const appUserSchema = new mongoose.Schema(
  {
    name: { type: String, default: null },

    phoneNo: { type: String, default: null },
    password: { type: String, required: true },

    profilePicture: { type: String, default: null },
    refreshToken: { type: String, default: null },
    otp: { type: String, default: null },
    provider: {
      type: String,
      enum: ["GOOGLE", "LOCAL"],
      default: "LOCAL",
    },
    otpExpiry: { type: Date, default: null },
    refreshTokenExpiry: { type: Date, default: null },

    event: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }],
  },
  { timestamps: true }
);

export const AppUser = mongoose.model("AppUser", appUserSchema);
