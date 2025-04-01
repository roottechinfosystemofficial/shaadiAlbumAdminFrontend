import mongoose from "mongoose";

const albumFileSchema = new mongoose.Schema(
  {
    key: { type: String, required: true }, // File identifier (e.g., Cloud storage key)
    mimeType: { type: String, required: true }, // File type (e.g., image/jpeg, video/mp4)
    albumCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AlbumCategory",
      required: true,
    },
    desktopImageKey: { type: String, default: null }, // Optional desktop image version
    mobileImageKey: { type: String, default: null }, // Optional mobile image version
  },
  { timestamps: true } // Automatically adds createdAt & updatedAt
);



module.exports = mongoose.model("AlbumFile", albumFileSchema);
