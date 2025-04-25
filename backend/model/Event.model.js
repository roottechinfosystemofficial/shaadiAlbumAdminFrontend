import mongoose from "mongoose";

const subEventSchema = new mongoose.Schema(
  {
    subEventName: { type: String, required: true },

    subEventTotalImages: { type: Number },
  },
  { timestamps: true }
);

// Embedded directly in the Event schema
const eventSchema = new mongoose.Schema(
  {
    eventName: { type: String, required: true },
    eventDate: { type: Date, required: true },
    isPublished: { type: Boolean, default: false },
    eventCode: { type: String, unique: true, sparse: true },
    eventDeleteDate: { type: Date },
    eventPassword: { type: String },
    eventImage: { type: String },
    eventTotalImages: { type: Number },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    subevents: [subEventSchema], // Embedding the subevents array
  },
  { timestamps: true }
);

export default mongoose.model("Event", eventSchema);
