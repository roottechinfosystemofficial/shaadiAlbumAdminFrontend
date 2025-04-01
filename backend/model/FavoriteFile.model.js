import mongoose from "mongoose";

const favoriteFileSchema = new mongoose.Schema(
  {
    albumFileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AlbumFile",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true } // Automatically adds createdAt & updatedAt fields
);



module.exports = mongoose.model("FavoriteFile", favoriteFileSchema);
