import mongoose from "mongoose";
const albumSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    action: {
      type: String,
      enum: ["E_ALBUM", "VIDEOBOOK"], // Enum values from ActionType
      required: true,
    },
    studioId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    songs: { type: String, default: null },
    code: { type: String, unique: true, sparse: true },
    contactPerson: { type: [String], default: [] },
    senderEmailIDs: { type: [String], default: [] },
    profileAttached: { type: Boolean, default: false },
    isSingleSlided: { type: Boolean, default: false },
  },
  { timestamps: true } // Automatically adds createdAt & updatedAt
);


module.exports = mongoose.model("Album", albumSchema);
