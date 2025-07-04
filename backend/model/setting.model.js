import mongoose from "mongoose";

const settingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // Each user has only one settings document
    },
    watermarkType: {
      type: String,
      enum: ["text", "icon"],
      default: "text",
    },
    watermarkText: { type: String, default: "Dhruv" },
    fontStyle: {
      type: String,
      enum: ["Arial", "Times New Roman", "Courier New", "Verdana"],
      default: "Arial",
    },
    fontColor: {
      type: String,
      enum: ["white", "black", "gray", "red", "blue"],
      default: "white",
    },
    fontSize: { type: Number, default: 75 },
    iconSize :{type:Number,default:5},
    opacity: { type: Number, min: 0, max: 100, default: 50 },
    waterMarkEnabled:{
        type : Boolean,
        default:false

      },
    position: {
      type: String,
      enum: [
        "top-left",
        "top-center",
        "top-right",
        "center-left",
        "center",
        "center-right",
        "bottom-left",
        "bottom-center",
        "bottom-right",
      ],
      
      default: "bottom-right",
    },
    iconImg: { type: String, default: null }, // URL or path to icon image
  },
  { timestamps: true }
);

export const Setting = mongoose.model("Setting", settingSchema);
