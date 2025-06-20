import { User } from "../model/User.model.js";
import bcrypt from "bcrypt";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { ClientViewUser } from "../model/ClientViewUser.model.js";
import Event from "../model/Event.model.js";
import {
  S3Client,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";
import dotenv from "dotenv";
dotenv.config();

const s3Client = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.ACCESSID,
    secretAccessKey: process.env.SECRETACCESSKEY,
  },
});
export const signup = async (req, res) => {
  try {
    const { name, businessName, email, password, phone } = req.body;
    console.log(req.body);

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ApiError(400, "Email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const logoUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
      name
    )}&background=random&color=fff`;
    const createdUser = await User.create({
      phoneNo: phone,
      name,
      businessName,
      email,
      password: hashedPassword,
      logo: logoUrl,
    });

    return res.json(
      new ApiResponse(201, createdUser, "User created successfully")
    );
  } catch (error) {
    console.error("🔴 Error in signup:", error);
    return res.status(400).json(new ApiResponse(400, null, error.message));
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      throw new ApiError(404, "User not found with this email");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new ApiError(400, "Invalid credentials");
    }

    const accessToken = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    user.refreshToken = refreshToken;
    user.refreshTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    user.lastSeen = new Date();
    await user.save();

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          user: {
            name: user.name,
            role: user.role,
            email: user.email,
            logo: user.logo,
          },
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
    );
  } catch (error) {
    console.error("🔴 Error in login:", error);
    return res.status(400).json(new ApiResponse(400, null, error.message));
  }
};

export const selectForgotPasswordOTPProvider = async (req, res) => {
  try {
    console.log(req.query);

    const { email } = req.query;
    const user = await User.findOne({ email });
    if (!user) {
      throw new ApiError(404, "User not found with this email");
    }
    const maskedPhone =
      user.phoneNo && user.phoneNo.length > 4
        ? `${"*".repeat(user.phoneNo.length - 4)}${user.phoneNo.slice(-4)}`
        : null;

    const maskedEmail =
      user.email && user.email.includes("@")
        ? `${user.email[0]}*****${user.email.substring(
          user.email.indexOf("@")
        )}`
        : null;

    res.status(200).json(
      new ApiResponse(
        200,
        {
          options: {
            sms: maskedPhone,
            email: maskedEmail,
          },
        },
        "Choose a method to reset your password"
      )
    );
  } catch (error) {
    console.error("🔴 Error in selectForgotPasswordOTPProvider:", error);
    return res.status(400).json(new ApiResponse(400, null, error.message));
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    return res
      .status(200)
      .json(
        new ApiResponse(200, user, "current user details fetched successfully")
      );
  } catch (error) {
    console.error("🔴 Error in getCurrentUser:", error);
    return res.status(400).json(new ApiResponse(400, null, error.message));
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      throw new ApiError(400, "All password fields are required.");
    }

    const userId = req.userId;
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isPasswordValid) {
      throw new ApiError(400, "Incorrect current password.");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Password changed successfully"));
  } catch (error) {
    console.error("🔴 Error in changePassword:", error);
    return res
      .status(error.statusCode || 500)
      .json(new ApiResponse(error.statusCode || 500, null, error.message));
  }
};
export const editProfile = async (req, res) => {
  try {
    const { name, address } = req.body;
    const userId = req.userId;

    if (!userId) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "UserId not found"));
    }
    const updateData = {};
    if (name) updateData.name = name;
    if (address) updateData.address = address;

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    }).select("-password");

    if (!updatedUser) {
      return res.status(404).json(new ApiResponse(404, null, "User not found"));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, updatedUser, "Profile updated successfully"));
  } catch (error) {
    console.error("🔴 Error in editProfile:", error);
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Something went wrong"));
  }
};

export const logoutUser = async (req, res) => {
  try {
    const token = req.cookies?.accessToken;

    if (!token) {
      return res
        .status(200)
        .json(new ApiResponse(200, {}, "Already logged out"));
    }

    // Decode without verifying (because token may be expired)
    const decoded = jwt.decode(token);
    const userId = decoded?.userId;

    if (!userId) {
      return res
        .status(200)
        .json(new ApiResponse(200, {}, "Already logged out"));
    }

    // Clear refreshToken
    await User.findByIdAndUpdate(userId, {
      $set: { refreshToken: "", refreshTokenExpiry: "" },
    });

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "User logged out successfully"));
  } catch (error) {
    console.error("Logout Error:", error);
    return res
      .status(500)
      .json(new ApiResponse(500, {}, "Internal Server Error"));
  }
};

export const checkAuth = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId).select(
      "name email role logo address trialFinished"
    );
    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    console.log("🔴 Auth check failed:", error.message);
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

export const refreshAccessToken = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

    if (!refreshToken) {
      throw new ApiError(401, "Refresh token required");
    }

    const tokenInDB = await User.findOne({ refreshToken }).select(
      "refreshToken refreshTokenExpiry"
    );

    if (!tokenInDB) {
      throw new ApiError(401, "Invalid refresh token");
    }
    if (tokenInDB.refreshToken !== refreshToken) {
      throw new ApiError(401, "Invalid refresh token");
    }
    if (tokenInDB.refreshTokenExpiry < new Date()) {
      throw new ApiError(401, "Refresh token expired");
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    if (!decoded) {
      throw new ApiError(401, "Invalid refresh token");
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    const accessToken = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "1d",
      }
    );

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { token: accessToken },
          "Access token refreshed successfully"
        )
      );
  } catch (error) {
    console.error("🔴 Error in refreshAccessToken:", error);
    return res.status(400).json(new ApiResponse(400, null, error.message));
  }
};




export const getDashboardDetails = async (req, res) => {
  try {
    const userId = req.userId;

    // Get total counts
    const currentUser = await User.findById(userId);

    const currentEmail=currentUser?.email;

    console.log("currentUser",currentUser)

    const userEventIds = await Event.find({ user: userId }).distinct('_id');

    // Count of users viewing those events
    const totalUsers = await ClientViewUser.countDocuments({
      eventId: { $in: userEventIds }
    });

    // Count of events created by the user
    const totalEvents = await Event.countDocuments({ user: userId });


    // Get current user details
    if (!currentUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Count events created by this user
    const userEvents = await Event.find({ user: userId }, "_id"); // Fetch user's events
    // const userEventsCount = userEvents.length;

    // Count images in S3 for these events
    let userImageCount = 0;
    for (const event of userEvents) {

      const prefix = `eventimages/${event._id}/`;
      let continuationToken;

      do {
        const listCommand = new ListObjectsV2Command({
          Bucket: process.env.BUCKET_NAME,
          Prefix: prefix,
          MaxKeys: 1000,
          ContinuationToken: continuationToken,
        });

        const response = await s3Client.send(listCommand);

        const imageFiles = (response.Contents || []).filter(item =>
          item.Key.match(/\.(jpg|jpeg|png|gif|webp)$/i)
        );

        userImageCount += imageFiles.length;

        continuationToken = response.IsTruncated ? response.NextContinuationToken : null;
      } while (continuationToken);
    }
    // Return combined result
    res.status(200).json({
      totalUsers,
      totalEvents,
      // userEventsCount,
      userImageCount,
    });

  } catch (error) {
    console.error("🔴 Dashboard fetch failed:", error.message);
    res.status(500).json({ error: error.message });
  }
};