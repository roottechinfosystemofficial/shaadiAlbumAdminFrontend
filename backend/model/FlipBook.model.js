import mongoose from "mongoose";

const flipBookSchema = new mongoose.Schema(
  {
    flipBookName: { type: String, required: true },
    flipBookImagesCount: { type: Number, required: true },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FlipBook", flipBookSchema);
