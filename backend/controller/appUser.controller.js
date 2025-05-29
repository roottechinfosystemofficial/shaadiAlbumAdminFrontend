import { AppUser } from "../model/AppUser.model.js";
import bcrypt from "bcrypt";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import Event from "../model/Event.model.js";

export const signUp = async (req, res) => {
  try {
    const { name, password, phone } = req.body;
    console.log(req.body);

    const existingUser = await AppUser.findOne({ phoneNo: phone });
    if (existingUser) {
      throw new ApiError(400, "phone already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const createdUser = await AppUser.create({
      phoneNo: phone,
      name,
      password: hashedPassword,
    });

    return res.json(
      new ApiResponse(201, createdUser, "AppUser created successfully")
    );
  } catch (error) {
    console.error("🔴 Error in signup:", error);
    return res.status(400).json(new ApiResponse(400, null, error.message));
  }
};

export const login = async (req, res) => {
  try {
    const { phone, password } = req.body;

    // First, fetch user WITH password
    const userWithPassword = await AppUser.findOne({ phoneNo: phone }).select(
      "+password"
    );

    if (!userWithPassword) {
      throw new ApiError(404, "AppUser not found with this phone number");
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(
      password,
      userWithPassword.password
    );
    if (!isPasswordValid) {
      throw new ApiError(400, "Invalid credentials");
    }

    // Now re-fetch the user with populated fields and without password
    const user = await AppUser.findById(userWithPassword._id)
      .select("-password")
      .populate("searchEvent")
      .populate("imageSelectionEvent");

    // Generate access token
    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "5d" }
    );

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          user: user,
          accessToken,
        },
        "AppUser logged in successfully"
      )
    );
  } catch (error) {
    console.error("🔴 Error in login:", error);
    return res.status(400).json(new ApiResponse(400, null, error.message));
  }
};

export const changePassword = async (req, res) => {
  try {
    const { phone, oldPassword, newPassword } = req.body;

    if (!phone || !oldPassword || !newPassword) {
      throw new ApiError(400, "Missing required fields");
    }

    const user = await AppUser.findOne({ phoneNo: phone });
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      throw new ApiError(401, "Old password is incorrect");
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    return res.json(
      new ApiResponse(200, null, "Password changed successfully")
    );
  } catch (error) {
    console.error("🔴 Error in changePassword:", error);
    return res.status(400).json(new ApiResponse(400, null, error.message));
  }
};

export const user = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await AppUser.findById(userId)
      .select("-password")
      .populate("searchEvent")
      .populate("imageSelectionEvent");

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, user, "Current user details fetched successfully")
      );
  } catch (error) {
    console.error("🔴 Error in getCurrentUser:", error);
    return res.status(400).json(new ApiResponse(400, null, error.message));
  }
};
export const updateUserName = async (req, res) => {
  try {
    const userId = req.userId;
    const { name } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({ error: "Name cannot be empty" });
    }

    const updatedUser = await AppUser.findByIdAndUpdate(
      userId,
      { name },
      { new: true }
    );

    res.status(200).json({ message: "Profile updated", user: updatedUser });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ error: "Server error" });
  }
};
export const findEventByEventcode = async (req, res) => {
  try {
    const { eventCode } = req.body;
    const userId = req.userId; // Make sure this is set by your auth middleware

    if (!eventCode) {
      return res.status(400).json({
        success: false,
        message: "Event code is required",
      });
    }

    const findedEvent = await Event.findOne({ eventCode });

    if (!findedEvent) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    if (userId) {
      const user = await AppUser.findById(userId);

      if (user) {
        const alreadyJoined = user.searchEvent.some(
          (e) => e.toString() === findedEvent._id.toString()
        );

        if (!alreadyJoined) {
          user.searchEvent.push(findedEvent._id);
          await user.save();
        }
      }
    }

    return res.status(200).json({
      success: true,
      eventId: findedEvent._id,
      event: findedEvent,
    });
  } catch (error) {
    console.error("Error finding event by code:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const deleteSearchedEvent = async (req, res) => {
  try {
    const { eventId } = req.body;
    const userId = req.userId; // set via auth middleware

    if (!eventId) {
      return res.status(400).json({
        success: false,
        message: "Event ID is required",
      });
    }

    const user = await AppUser.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const index = user.searchEvent.findIndex(
      (e) => e.toString() === eventId.toString()
    );

    if (index === -1) {
      return res.status(400).json({
        success: false,
        message: "Event not found in search list",
      });
    }

    user.searchEvent.splice(index, 1);
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Event removed from search history",
      removedEventId: eventId,
    });
  } catch (error) {
    console.error("Error deleting searched event:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const findEventByEventPin = async (req, res) => {
  try {
    const { eventPin } = req.body;
    const userId = req.userId; // Make sure this is set by your auth middleware

    if (!eventPin) {
      return res.status(400).json({
        success: false,
        message: "Event Pin is required",
      });
    }

    const findedEvent = await Event.findOne({ eventPassword: eventPin });

    if (!findedEvent) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    if (userId) {
      const user = await AppUser.findById(userId);

      if (user) {
        const alreadyJoined = user.imageSelectionEvent.some(
          (e) => e.toString() === findedEvent._id.toString()
        );

        if (!alreadyJoined) {
          user.imageSelectionEvent.push(findedEvent._id);
          await user.save();
        }
      }
    }

    return res.status(200).json({
      success: true,
      eventId: findedEvent._id,
      event: findedEvent,
    });
  } catch (error) {
    console.error("Error finding event by PIN:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
export const updateClientSelectedImages = async (req, res) => {
  try {
    const { subEventId, image } = req.body;

    const event = await Event.findOne({ "subevents._id": subEventId });
    if (!event) return res.status(404).json({ message: "SubEvent not found" });

    const subevent = event.subevents.id(subEventId);

    const imageIndex = subevent.clientSelectedImages.findIndex(
      (img) => img.id === image.id
    );

    if (imageIndex > -1) {
      // Image already exists → remove it
      subevent.clientSelectedImages.splice(imageIndex, 1);
      await event.save();
      return res.status(200).json({ message: "Image deselected successfully" });
    } else {
      // Image not present → add it
      subevent.clientSelectedImages.push(image);
      event.markModified("subevents");
      await event.save();
      return res.status(200).json({ message: "Image selected successfully" });
    }
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
export const finalSubmitImages = async (req, res) => {
  try {
    const { subEventId, images } = req.body;
    
    if (!subEventId || !images || !Array.isArray(images)) {
      return res.status(400).json({ message: "Invalid request data" });
    }

    const event = await Event.findOne({ "subevents._id": subEventId });
    if (!event) {
      return res.status(404).json({ message: "SubEvent not found" });
    }

    const subevent = event.subevents.id(subEventId);
    if (!subevent) {
      return res.status(404).json({ message: "SubEvent not found" });
    }

    // Validate image objects
    for (const image of images) {
      if (!image.id || !image.thumbnailUrl || !image.originalUrl) {
        return res.status(400).json({
          message: "Each image must include id, thumbnailUrl, and originalUrl",
        });
      }
    }

    // Overwrite with new selections
    subevent.clientSelectedImages = images;

    // Optional: Update total count
    subevent.subEventTotalImages = images.length;

    await event.save();

    return res.status(200).json({ message: "Images submitted successfully" });
  } catch (error) {
    console.error("Error submitting final images:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getSubEventImages = async (req, res) => {
  const { eventId, subEventId } = req.body;

  try {
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const subEvent = event.subevents.id(subEventId);

    if (!subEvent) {
      return res.status(404).json({ message: "Sub-event not found" });
    }

    if (
      subEvent.clientSelectedImages &&
      subEvent.clientSelectedImages.length > 0
    ) {
      return res.status(200).json({ images: subEvent.clientSelectedImages });
    } else {
      return res.status(200).json({ images: [] });
    }
  } catch (error) {
    console.error("Error fetching sub-event images:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
