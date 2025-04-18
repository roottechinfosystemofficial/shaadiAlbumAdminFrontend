import { User } from "../model/User.model.js";
import bcrypt from "bcrypt";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";

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
    const { oldPassword, newPassword } = req.body;

    const userId = req.userId;
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      throw new ApiError(400, "Invalid old password");
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    return res
      .status(200)
      .json(new ApiResponse(200, null, "Password changed successfully"));
  } catch (error) {
    console.error("🔴 Error in changePassword:", error);
    return res.status(400).json(new ApiResponse(400, null, error.message));
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

export const editPofile = async (req, res) => {
  try {
    const {
      name,
      address,
      phoneNo,
      country,
      city,
      zipcode,
      coverImage,
      about,
      studioName,
      logo,
    } = req.body;
    const updatedProfileDetails = {
      ...(req.role === "STUDIO_ADMIN" && { studioName }),
      ...(name && { name }),
      ...(address && { address }),
      ...(phoneNo && { phoneNo }),
      ...(country && { country }),
      ...(city && { city }),
      ...(zipcode && { zipcode }),
      ...(about && { about }),
      ...(logo && { logo }),
      ...(coverImage && { coverImage }),
    };

    const user = await User.findByIdAndUpdate(
      req.userId,
      { $set: updatedProfileDetails },
      { new: true }
    );
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, user, "Profile updated successfully"));
  } catch (error) {
    console.error("🔴 Error in editPofile:", error);
    return res.status(400).json(new ApiResponse(400, null, error.message));
  }
};

export const logoutUser = async (req, res) => {
  try {
    const refreshToken =
      req.body?.refreshToken ||
      req.cookies?.refreshToken ||
      req.headers?.authorization;

    const userId = req.userId;

    if (!userId) {
      return res.status(400).json(new ApiResponse(400, {}, "User not found"));
    }

    if (!refreshToken) {
      return res
        .status(400)
        .json(new ApiResponse(400, {}, "Refresh token missing"));
    }
    console.log(refreshToken);

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // <-- for localhost testing
      sameSite: "lax", // safer for local
      path: "/",
    };

    const user = await User.findOneAndUpdate(
      { _id: userId, refreshToken },
      { $set: { refreshToken: "", refreshTokenExpiry: "" } }
    );

    if (!user) {
      throw new ApiError(404, "User not found or invalid refresh token");
    }

    res.clearCookie("refreshToken", options);
    res.clearCookie("accessToken", options);

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "User logged out successfully"));
  } catch (error) {
    console.error("🔴 Error in logoutUser:", error);
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal Server Error"));
  }
};

export const checkAuth = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId).select("name email role logo");
    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    console.log("🔴 Auth check failed:", error.message);
    res.status(401).json({ error: "Invalid or expired token" });
  }
};
