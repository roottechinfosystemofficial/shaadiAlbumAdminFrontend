import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    const token = req.cookies?.accessToken || req.headers?.authorization;

    if (!token) {
      throw new ApiError(401, "unathorized request");
    }
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if (!decodedToken) {
      throw new ApiError(401, "Failed to decode token");
    }
    req.userId = decodedToken.userId;
    req.userRole = decodedToken.role;

    next();
  } catch (err) {
    throw new ApiError(401, err?.message);
  }
});

export const verifySuperAdmin = asyncHandler(async (req, res, next) => {
  if (req.user.role !== "SUPER_ADMIN") {
    throw new ApiError(401, "unauthorized request");
  }
  next();
});

export const verifyStudioAdmin = asyncHandler(async (req, res, next) => {
  console.log(req.user.role);
  if (req.user.role !== "STUDIO_ADMIN") {
    throw new ApiError(401, "unauthorized request");
  }
  next();
});
