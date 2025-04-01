import mongoose from "mongoose";

const faceMetadataSchema = new mongoose.Schema(
  {
    faceId: { type: String, default: null }, // Optional face identifier
    key: { type: String, required: true }, // Unique key for the metadata
    imageId: { type: String, default: null }, // Optional reference to an image
    albumFileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AlbumFile",
      required: true,
    },
  },
  { timestamps: true } // Automatically adds createdAt & updatedAt
);



module.exports = mongoose.model("FaceMetadata", faceMetadataSchema);
