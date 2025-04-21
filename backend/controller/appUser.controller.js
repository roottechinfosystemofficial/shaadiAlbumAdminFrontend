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

    const user = await AppUser.findOne({ phoneNo: phone });
    if (!user) {
      throw new ApiError(404, "AppUser not found with this email");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new ApiError(400, "Invalid credentials");
    }

    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    await user.save();

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          user: {
            name: user.name,
            phone: user.phoneNo,
            dp: user.profilePicture,
          },
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

export const user = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await AppUser.findById(userId)
      .select("-password")
      .populate("searchEvent");

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
