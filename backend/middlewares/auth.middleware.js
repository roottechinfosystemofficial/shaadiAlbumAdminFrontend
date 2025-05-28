import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";

export const verifyJWT = async (req, res, next) => {
  try {
    const bearerToken = req.headers.authorization?.startsWith("Bearer")
      ? req.headers.authorization.split(" ")[1]
      : null;

    const token = bearerToken || req?.cookies?.accessToken;

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: Token missing", logout: true });
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    req.userId = decodedToken.userId;
    req.userRole = decodedToken.role;

    next();
  } catch (err) {
    console.error("JWT verification failed:", err.message);

    const isTokenExpired = err.name === "TokenExpiredError";

    return res.status(401).json({
      message: isTokenExpired
        ? "Session expired. Please log in again."
        : "Unauthorized",
      logout: isTokenExpired,
    });
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
