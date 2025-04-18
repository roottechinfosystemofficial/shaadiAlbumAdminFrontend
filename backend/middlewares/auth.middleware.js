import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";

// Verify JWT Middleware
export const verifyJWT = async (req, _, next) => {
  try {
    // Extract token from Authorization header or cookies
    const bearerToken = req.headers.authorization?.startsWith("Bearer")
      ? req.headers.authorization.split(" ")[1]
      : null;

    const token = bearerToken || req?.cookies?.accessToken;

    console.log("Token Received:", token);

    if (!token) {
      throw new ApiError(401, "Unauthorized request: Token missing");
    }

    // Verify the JWT token
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Attach user info to request object
    req.userId = decodedToken.userId;
    req.userRole = decodedToken.role;

    next(); // Proceed to next middleware or route handler
  } catch (err) {
    console.error("JWT verification failed:", err.message);
    throw new ApiError(401, err?.message || "Unauthorized");
  }
};

// Verify Super Admin Middleware
export const verifySuperAdmin = (req, res, next) => {
  if (req.userRole !== "SUPER_ADMIN") {
    throw new ApiError(401, "Unauthorized request");
  }
  next(); // Proceed to next middleware or route handler
};

// Verify Studio Admin Middleware
export const verifyStudioAdmin = (req, res, next) => {
  console.log(req.userRole);
  if (req.userRole !== "STUDIO_ADMIN") {
    throw new ApiError(401, "Unauthorized request");
  }
  next(); // Proceed to next middleware or route handler
};
