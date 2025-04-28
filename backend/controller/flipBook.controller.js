import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

export const createFlipBook = async (req, res) => {
  try {
    const { flipBookName, eventID } = req.body;

    if (!flipBookName) {
      throw new ApiError(400, "Flipbook name is required");
    }
    console.log(flipBookName, eventID);
  } catch (error) {
    console.error("🔴 Error in createFlipbook:", error);
    return res.status(400).json(new ApiResponse(400, null, error.message));
  }
};
