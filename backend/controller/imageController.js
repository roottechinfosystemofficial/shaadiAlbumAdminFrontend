import ImageMetadata from "../model/ImageMetadata.js";

export const storeImageMetadata = async (req, res) => {
  const { eventId, originalImageKey, thumbnailImageKey } = req.body;
  console.log(req.body);

  try {
    const newImageMetadata = new ImageMetadata({
      eventId,
      originalImageKey,
      thumbnailImageKey,
      status: "uploaded",
    });

    await newImageMetadata.save();

    return res
      .status(200)
      .json({ message: "Image metadata saved successfully!" });
  } catch (error) {
    console.error("Error storing image metadata:", error);
    return res.status(500).json({ message: "Failed to store image metadata" });
  }
};
