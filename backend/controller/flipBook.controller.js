import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import FlipBook from "../model/FlipBook.model.js";

export const createFlipBook = async (req, res) => {
  try {
    const { flipBookName } = req.body;
    const eventId = req.params.eventId;

    if (!flipBookName || !eventId) {
      throw new ApiError(400, "Details are required");
    }

    const newFlipbook = await FlipBook.create({
      flipBookName,
      eventId,
    });

    return res
      .status(200)
      .json(new ApiResponse(200, newFlipbook, "Flipbook created successfully"));
  } catch (error) {
    console.error("🔴 Error in createFlipBook:", error);
    return res.status(400).json(new ApiResponse(400, null, error.message));
  }
};

export const getAllFlipBookByEvent = async (req, res) => {
  try {
    const eventId = req.params.eventId;

    if (!eventId) {
      throw new ApiError(400, "Event ID is required");
    }

    const flipbooks = await FlipBook.find({ eventId }).populate({
      path: "eventId",
      select: "eventName eventCode ",
    });

    return res
      .status(200)
      .json(new ApiResponse(200, flipbooks, "Flipbooks fetched successfully"));
  } catch (error) {
    console.error("🔴 Error in getAllFlipBookByEvent:", error);
    return res.status(400).json(new ApiResponse(400, null, error.message));
  }
};

export const getSingleFlipbookById = async (req, res) => {
  try {
    const flipBookId = req.params.flipBookId;

    if (!flipBookId) {
      return res.status(400).json({ error: "flipBookId is required" });
    }

    const flipbook = await FlipBook.findById(flipBookId);

    if (!flipbook) {
      return res.status(404).json({ error: "Flipbook not found" });
    }

    return res
      .status(200)
      .json(new ApiResponse(200, flipbook, "Flipbook fetched successfully"));
  } catch (error) {
    console.error("Error fetching flipbook:", error);
    return res.status(400).json(new ApiResponse(400, null, error.message));
  }
};

export const setFrontBackCoverImg = async (req, res) => {
  try {
    const { flipbookId, imageIndex, type } = req.body;

    if (
      !flipbookId ||
      !Number.isInteger(imageIndex) ||
      !["front", "back"].includes(type)
    ) {
      return res.status(400).json({ message: "Invalid data provided" });
    }

    const updateField =
      type === "front"
        ? { "flipbookImages.frontCoverImageIndex": imageIndex }
        : { "flipbookImages.backCoverImageIndex": imageIndex };

    const updated = await FlipBook.findByIdAndUpdate(
      flipbookId,
      { $set: updateField },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Flipbook not found" });
    }

    return res.status(200).json({
      message: `${type} cover updated successfully`,
      flipbook: updated,
    });
  } catch (error) {
    console.error("Error setting cover image index:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
