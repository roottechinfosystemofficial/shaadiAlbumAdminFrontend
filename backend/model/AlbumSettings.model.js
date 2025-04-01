import mongoose from "mongoose";

const albumSettingsSchema = new mongoose.Schema(
  {
    albumId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Album",
      required: true,
    },
    name: { type: String, required: true }, // Name of the settings
    isDataDownloadable: { type: Boolean, default: false }, // Can data be downloaded?
    isDataSharable: { type: Boolean, default: false }, // Can data be shared?
    isUserCanUpload: { type: Boolean, default: false }, // Can users upload?
    isCollectClientData: { type: Boolean, default: false }, // Should client data be collected?
    date: { type: Date, default: null }, // Optional date
  },
  { timestamps: true } // Automatically adds createdAt & updatedAt
);



module.exports = mongoose.model("AlbumSettings", albumSettingsSchema);
