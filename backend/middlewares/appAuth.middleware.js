import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const verifyAppJWT = asyncHandler(async (req, _, next) => {
  try {
    const token = req.headers.authorization;

    console.log("Token Received:", token);

    if (!token) {
      throw new ApiError(401, "Unauthorized request: Token missing");
    }

    // Verify token using the correct secret
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    req.userId = decodedToken.userId;

    next();
  } catch (err) {
    console.error("JWT verification failed:", err.message);
    throw new ApiError(401, err?.message || "Unauthorized");
  }
});
