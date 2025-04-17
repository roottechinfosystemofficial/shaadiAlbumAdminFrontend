import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    // Check token in cookies or Authorization header
    const bearerToken = req.headers.authorization?.startsWith("Bearer")
      ? req.headers.authorization.split(" ")[1]
      : null;

    const token = bearerToken || req?.cookies?.accessToken;

    console.log("Token Received:", token);

    if (!token) {
      throw new ApiError(401, "Unauthorized request: Token missing");
    }

    // Verify token using the correct secret
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    req.userId = decodedToken.userId;
    req.userRole = decodedToken.role;

    next();
  } catch (err) {
    console.error("JWT verification failed:", err.message);
    throw new ApiError(401, err?.message || "Unauthorized");
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
