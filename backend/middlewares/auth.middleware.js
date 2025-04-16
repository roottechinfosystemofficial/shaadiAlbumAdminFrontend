import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    console.log(req.cookies);

    let token = req.cookies?.accessToken;

    // If not in cookies, try Authorization header
    if (!token && req.headers?.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      throw new ApiError(401, "Unauthorized request: Token missing");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    req.userId = decodedToken.userId;
    req.userRole = decodedToken.role;

    next();
  } catch (err) {
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
