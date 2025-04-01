import { validationResult } from "express-validator";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const validateRequest = asyncHandler((req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ApiError(400, errors.array(), "Validation failed");
  }
  next();
});

export { validateRequest };
