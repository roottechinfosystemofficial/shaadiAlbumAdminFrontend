import mongoose from "mongoose";

const flipBookImagesSchema = new mongoose.Schema(
  {
    frontCoverImageIndex: { type: Number }, // Store the index
    backCoverImageIndex: { type: Number }, // Store the index
  },
  { _id: false }
);
const flipBookSchema = new mongoose.Schema(
  {
    flipBookName: { type: String, required: true },
    flipBookImagesCount: { type: Number, default: 0 },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    flipbookImages: {
      type: flipBookImagesSchema,
      default: {},
    },
  },
  { timestamps: true }
);

export default mongoose.model("FlipBook", flipBookSchema);
