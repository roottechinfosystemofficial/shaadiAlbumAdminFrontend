import { ApiResponse } from "../utils/ApiResponse.js";
import Event from "../model/Event.model.js";

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

    if (events.length === 0) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "No events found for this user"));
    }

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