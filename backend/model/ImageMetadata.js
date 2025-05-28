import mongoose from "mongoose";

const imageMetadataSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    originalImageKey: { type: String, required: true },
    thumbnailImageKey: { type: String, required: true },
    status: {
      type: String,
      enum: ["uploaded", "pending", "failed"],
      default: "pending",
    },
    uploadedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const ImageMetadata = mongoose.model("ImageMetadata", imageMetadataSchema);
export default ImageMetadata;
