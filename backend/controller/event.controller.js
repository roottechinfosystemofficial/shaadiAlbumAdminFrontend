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

export const editEventById = async (req, res) => {
  try {
    const { eventName, eventDate, eventCode, eventPassword, eventDeleteDate } =
      req.body;
    const eventId = req.params.eventId;

    const findEvent = await Event.findById(eventId);

    if (!findEvent) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Event not found"));
    }

    // Update only if the field is provided
    if (eventName !== undefined) findEvent.eventName = eventName;
    if (eventDate !== undefined) findEvent.eventDate = new Date(eventDate);
    if (eventCode !== undefined) findEvent.eventCode = eventCode;
    if (eventPassword !== undefined) findEvent.eventPassword = eventPassword;
    if (eventDeleteDate !== undefined)
      findEvent.eventDeleteDate = new Date(eventDeleteDate);

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
