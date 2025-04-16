import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    eventName: { type: String, required: true },
    eventDate: { type: Date, required: true },
    isPublished: { type: Boolean, default: false },
    eventCode: { type: String, unique: true, sparse: true },
    eventDeleteDate: { type: Date },
    eventPassword: { type: String },
    eventImage: { type: String },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Event", eventSchema);
