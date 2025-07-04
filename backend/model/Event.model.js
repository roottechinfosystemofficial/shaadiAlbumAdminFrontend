import mongoose from "mongoose";

const subEventSchema = new mongoose.Schema(
  {
    subEventName: { type: String, required: true },

    subEventTotalImages: { type: Number },
    clientSelectedImages: [
      {
        id: { type: String, required: true },
        thumbnailUrl: { type: String, required: true },
        originalUrl: { type: String, required: true },
      },
    ],
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
    coverImage: { type: String },
    coverImagePosition: {
      type: String,
      enum: ["left", "center", "right", "bottom"],
      default: "center",
    },

    eventTotalImages: { type: Number },
    eventDescription: { type: String },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    subevents: [subEventSchema], // Embedding the subevents array
    isImageDownloadEnabled: {
      type: Boolean,
      default: false
    },
  },
  { timestamps: true }
);

export default mongoose.model("Event", eventSchema);
