import mongoose from "mongoose";

const flipBookSchema = new mongoose.Schema(
  {
    flipBookName: { type: String, required: true },
    flipBookImagesCount: { type: Number },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("FlipBook", flipBookSchema);
