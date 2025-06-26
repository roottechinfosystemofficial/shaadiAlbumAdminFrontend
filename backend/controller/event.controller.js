import { ApiResponse } from "../utils/ApiResponse.js";
import Event from "../model/Event.model.js";
import { PutObjectCommand,S3Client ,GetObjectCommand,DeleteObjectCommand} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from 'dotenv'
import { v4 as uuidv4 } from "uuid";
import mongoose from "mongoose";

dotenv.config();
// const streamToBuffer = async (stream) => {
//   return new Promise((resolve, reject) => {
//     const chunks = [];
//     stream.on("data", (chunk) => chunks.push(chunk));
//     stream.on("end", () => resolve(Buffer.concat(chunks)));
//     stream.on("error", reject);
//   });
// };
  const s3 = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.ACCESSID,
    secretAccessKey: process.env.SECRETACCESSKEY,
  },
});

const generateRandomString = (length) => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const generateUniqueEventCode = async () => {
  let uniqueCode;
  let isUnique = false;

  while (!isUnique) {
    uniqueCode = generateRandomString(6);
    const existingEvent = await Event.findOne({ eventCode: uniqueCode });
    if (!existingEvent) {
      isUnique = true;
    }
  }
  return uniqueCode;
};
export const createEvent = async (req, res) => {
  try {
    const { eventName, eventDate } = req.body;

    if (!eventName || !eventDate) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "Event name and date are required"));
    }

    const eventCode = await generateUniqueEventCode();
    const eventPassword = generateRandomString(8);

    const newEvent = new Event({
      eventName,
      eventDate,
      eventCode,
      eventPassword,
      user: req.userId,
      eventImage:
        "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80",
      subevents: [
        {
          subEventName: "Highlights",
          subEventTotalImages: 0, // You can default this to 0
        },
      ],
    });

    const savedEvent = await newEvent.save();

    return res
      .status(200)
      .json(new ApiResponse(201, savedEvent, "Event created successfully"));
  } catch (error) {
    console.error("🔴 Error in createEvent:", error);
    return res.status(500).json(new ApiResponse(500, null, error.message));
  }
};

export const editEventById = async (req, res) => {
  try {
    const {
      eventName,
      eventDate,
      eventCode,
      eventPassword,
      eventDeleteDate,
      isPublished,
      imageCount,
      eventDescription,
    } = req.body;
    const eventId = req.params.eventId;

    const findEvent = await Event.findById(eventId);

    if (!findEvent) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Event not found"));
    }

    // Update only if the field is provided
    if (imageCount !== undefined) findEvent.eventTotalImages = imageCount;
    if (isPublished !== undefined) findEvent.isPublished = isPublished;
    if (eventName !== undefined) findEvent.eventName = eventName;
    if (eventDate !== undefined) findEvent.eventDate = new Date(eventDate);
    // Check for unique eventCode
    if (eventCode !== undefined && eventCode !== findEvent.eventCode) {
      const existingCode = await Event.findOne({ eventCode });
      if (existingCode && existingCode._id.toString() !== eventId) {
        return res
          .status(400)
          .json(new ApiResponse(400, null, "Event code already in use."));
      }
    }

    // Check for unique eventPassword
    if (
      eventPassword !== undefined &&
      eventPassword !== findEvent.eventPassword
    ) {
      const existingPassword = await Event.findOne({ eventPassword });
      if (existingPassword && existingPassword._id.toString() !== eventId) {
        return res
          .status(400)
          .json(new ApiResponse(400, null, "Event password already in use."));
      }
    }

    if (eventDeleteDate !== undefined)
      findEvent.eventDeleteDate = new Date(eventDeleteDate);
    if (eventDescription !== undefined)
      findEvent.eventDescription = eventDescription;
    await findEvent.save();

    return res
      .status(200)
      .json(new ApiResponse(200, findEvent, "Event updated successfully"));
  } catch (error) {
    console.error("🔴 Error in editEventById:", error);
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal Server Error"));
  }
};

export const getAllEventsOfUser = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "UserId Not Found"));
    }

    // Find events for the current user
    const events = await Event.find({ user: userId });

    // if (events.length === 0) {
    //   return res
    //     .status(404)
    //     .json(new ApiResponse(404, null, "No events found for this user"));
    // }

    return res
      .status(200)
      .json(new ApiResponse(200, events, "Events fetched successfully"));
  } catch (error) {
    console.error("🔴 Error in getAllEventsOfUser:", error);
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal Server Error"));
  }
};

export const getEventById = async (req, res) => {
  try {
    const eventId = req.params.eventId;

    if (!eventId) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "eventId not provided"));
    }

    const findEvent = await Event.findById(eventId);

    if (!findEvent) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Event not found"));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, findEvent, "Event fetched successfully"));
  } catch (error) {
    console.error("🔴 Error in getEventById:", error);
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal Server Error"));
  }
};

export const createSubEvent = async (req, res) => {
  try {
    const { subEventName } = req.body;
    const { eventId } = req.params;
    console.log(req.body);

    if (!subEventName) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "Sub-event name is required"));
    }

    const event = await Event.findById(eventId);

    if (!event) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Event not found"));
    }

    // Add new subevent
    const newSubEvent = { subEventName, subEventTotalImages: 0 };
    event.subevents.push(newSubEvent);
    await event.save();

    const createdSubEvent = event.subevents[event.subevents.length - 1]; // Get the last added one

    return res
      .status(201)
      .json(
        new ApiResponse(201, createdSubEvent, "Sub-event created successfully")
      );
  } catch (error) {
    console.error("🔴 Error in createSubEvent:", error);
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal Server Error"));
  }
};

export const updateDownloadSetting = async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findById(eventId);
    if (!event) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Event not found"));
    }

    return res.status(200).json(
      new ApiResponse(200, {
        isImageDownloadEnabled: event.isImageDownloadEnabled
      }, "Download setting Get successfully")
    );
  } catch (error) {
    console.error("🔴 Error in getDownloadSetting:", error);
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal Server Error"));
  }
};
export const updateDownloadSettingPost = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { isImageDownloadEnabled } = req.body;

    // Validate input
    if (typeof isImageDownloadEnabled !== 'boolean') {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "Boolean value required for isImageDownloadEnabled"));
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Event not found"));
    }

    // Update the toggle value
    event.isImageDownloadEnabled = isImageDownloadEnabled;
    await event.save();

    return res.status(200).json(
      new ApiResponse(200, {
        isImageDownloadEnabled: event.isImageDownloadEnabled
      }, "Download setting updated successfully")
    );
  } catch (error) {
    console.error("🔴 Error in updateDownloadSetting:", error);
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal Server Error"));
  }
};

// / event / getFavouriteImage
 export const getFavouriteImage = async (req, res) => {
  try {
    const { eventId } = req.body;

    const event = await Event.findOne(eventId);
    if (!event) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Event not found"));
    }

    return res.status(200).json(
      new ApiResponse(200, event, "Event Data Get successfully")
    );
  } catch (error) {
    console.error("🔴 Error in getFavouriteImage:", error);
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal Server Error"));
  }
};
export const deleteEventById=async(req,res)=>{
  console.log("DELETE event route hit. ID:", req.params.eventId);

  try {

    const { eventId } = req.params;

    if (!eventId) {
      return res.status(400).json({ error: "Missing eventId" });
    }

    // Check if event exists
    const existingEvent = await Event.findById(eventId);
    if (!existingEvent) {
      return res.status(404).json({ error: "Event not found" });
    }

    // Delete the event
    await Event.findByIdAndDelete(eventId);

    return res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Error deleting event:", error);
    return res.status(500).json({ error: "Internal server error" });
  }

}




export const uploadEventImage = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { base64Image, fileType = "image/jpeg" } = req.body;

    if (!base64Image) {
      return res.status(400).json({ error: "Missing base64 image" });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    const extension = fileType.split("/")[1] || "jpg";
    const key = `events/${eventId}/event-image-${uuidv4()}.${extension}`;

    // Decode base64 image
    const base64Data = Buffer.from(
      base64Image.replace(/^data:image\/\w+;base64,/, ""),
      "base64"
    );

    // Upload to S3
    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.BUCKET_NAME,
        Key: key,
        Body: base64Data,
        ContentEncoding: "base64",
        ContentType: fileType,
        // No ACL needed; you're using public bucket policy
      })
    );

    // Construct public S3 URL
    const publicUrl = `https://${process.env.BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    // Save the public URL to DB
    event.eventImage = publicUrl;
    await event.save();

    return res.status(200).json({
      message: "Image uploaded and accessible",
      imageUrl: publicUrl
    });
  } catch (err) {
    console.error("Upload eventImage error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};


export const deleteEventImage = async (req, res) => {
  try {
    const { eventId } = req.params;

    // 1. Find the event
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    if (!event.eventImage) {
      return res.status(400).json({ error: "No image found for this event" });
    }

    // 2. Extract S3 key from the image URL
    const imageUrl = event.eventImage;
    const urlParts = imageUrl.split(".amazonaws.com/");
    if (urlParts.length !== 2) {
      return res.status(400).json({ error: "Invalid image URL" });
    }

    const s3Key = urlParts[1]; // key is everything after amazonaws.com/

    // 3. Delete from S3
    await s3.send(
      new DeleteObjectCommand({
        Bucket: process.env.BUCKET_NAME,
        Key: s3Key,
      })
    );

    // 4. Remove image URL from DB
    event.eventImage = undefined;
    await event.save();

    return res.status(200).json({ message: "Event image deleted successfully" });
  } catch (err) {
    console.error("Delete eventImage error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};



// 2. Get eventImage URL if already uploaded
export const getEventImageUrl = async (req, res) => {
  console.log("hitted client call to endpoint")
  try {
    const { eventId } = req.params;

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ error: "Event not found" });

    // if (!event.eventImage) {
    //   return res.status(404).json({ error: "Event image not uploaded yet" });
    // }

    return res.status(200).json({ imageUrl: event.eventImage });
  } catch (err) {
    console.error("Get eventImage error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteSubEvent = async (req, res) => {
  try {
    const { eventId, subEventId } = req.query;

    // Validate IDs
    if (!mongoose.Types.ObjectId.isValid(eventId) || !mongoose.Types.ObjectId.isValid(subEventId)) {
      return res.status(400).json({ message: "Invalid eventId or subEventId." });
    }

    // Find the event
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found." });
    }

    // Check if subEvent exists
    const subEventIndex = event.subevents.findIndex(
      (sub) => sub._id.toString() === subEventId
    );

    if (subEventIndex === -1) {
      return res.status(404).json({ message: "Sub-event not found." });
    }

    // Remove the subevent
    event.subevents.splice(subEventIndex, 1);
    await event.save();

    return res.status(200).json({ message: "Sub-event deleted successfully." });
  } catch (error) {
    console.error("Error deleting sub-event:", error);
    return res.status(500).json({
      message: "Internal server error.",
      error: error.message,
    });
  }
};
