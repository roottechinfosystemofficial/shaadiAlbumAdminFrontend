import mongoose from "mongoose";

const albumCategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    albumId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Album",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    files: [{ type: mongoose.Schema.Types.ObjectId, ref: "AlbumFile" }],
  },
  { timestamps: true } // Automatically adds createdAt & updatedAt
);



module.exports = mongoose.model("AlbumCategory", albumCategorySchema);
