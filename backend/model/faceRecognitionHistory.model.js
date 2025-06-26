import mongoose from "mongoose";
import { type } from "os";

const faceRecognitionHistorySchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        event: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Event",
            required: true,
        },
        eventName:{
            type : String,
            

        },
        subEventId: {
            type: String, // or ObjectId if you give subEvent a proper _id
            required: true,
        },
        image: {
            type: String, // base64 or s3 URL of uploaded image
            required: true,
        },
        matches: [
            {
                key: String,
                similarity: String,
                url: String,
            },
        ],
        matchesCount:{
            type:Number,
            default:0

        }
    },
    { timestamps: true }
);

export const FaceRecognitionHistory = mongoose.model(
    "FaceRecognitionHistory",
    faceRecognitionHistorySchema
);