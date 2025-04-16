import mongoose from "mongoose";
const albumSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    action: {
      type: String,
      enum: ["E_ALBUM", "VIDEOBOOK"], 
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
    profileAttached: { type: Boolean, default: false },import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    eventDate: { type: Date, required: true },
    isPublished: { type: Boolean, default: false },
    eventcode: { type: String, unique: true, sparse: true }, // Optional: unique if used for access
    eventPassword: { type: String }, // You can hash this if needed
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Event", eventSchema);

    isSingleSlided: { type: Boolean, default: false },
  },
  { timestamps: true } // Automatically adds createdAt & updatedAt
);


module.exports = mongoose.model("Album", albumSchema);
