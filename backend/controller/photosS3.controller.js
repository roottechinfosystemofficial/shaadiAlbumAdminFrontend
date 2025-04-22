import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from "dotenv";

dotenv.config();

const s3Client = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.ACCESSID,
    secretAccessKey: process.env.SECRETACCESSKEY,
  },
});

// 🔹 Generate Pre-signed URL for Upload
export const getPresignedUrl = async (req, res) => {
  const { fileName, fileType, eventId } = req.query;

  if (!fileName || !fileType || !eventId) {
    return res
      .status(400)
      .json({ error: "Missing fileName, fileType, or eventId" });
  }

  const key = `eventimages/${eventId}/images/${Date.now()}-${fileName}`;

  const command = new PutObjectCommand({
    Bucket: process.env.BUCKET_NAME,
    Key: key,
    ContentType: fileType,
  });

  try {
    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600, // 1 hour
    });
    res.status(200).json({ url: signedUrl, key });
  } catch (err) {
    console.error("Error generating signed URL:", err);
    res.status(500).json({ error: "Could not generate signed URL" });
  }
};

export const getEventImages = async (req, res) => {
  const { eventId, page = 1 } = req.query;
  const pageSize = 300;

  if (!eventId) {
    return res.status(400).json({ error: "Missing eventId" });
  }

  const prefix = `eventimages/${eventId}/images/`;

  let allItems = [];
  let continuationToken;

  try {
    do {
      const listCommand = new ListObjectsV2Command({
        Bucket: process.env.BUCKET_NAME,
        Prefix: prefix,
        MaxKeys: 1000, // Get all items, we paginate manually
        ContinuationToken: continuationToken,
      });

      const response = await s3Client.send(listCommand);
      allItems = [...allItems, ...(response.Contents || [])];
      continuationToken = response.IsTruncated
        ? response.NextContinuationToken
        : null;
    } while (continuationToken);

    const startIndex = (page - 1) * pageSize;
    const paginatedItems = allItems.slice(startIndex, startIndex + pageSize);

    const imageUrls = await Promise.all(
      paginatedItems.map(async (item) => {
        const getCommand = new GetObjectCommand({
          Bucket: process.env.BUCKET_NAME,
          Key: item.Key,
        });
        return getSignedUrl(s3Client, getCommand, { expiresIn: 3600 });
      })
    );

    res.status(200).json({ images: imageUrls });
  } catch (err) {
    console.error("Error fetching images:", err);
    res.status(500).json({ error: "Could not retrieve images" });
  }
};
// Assuming this is inside eventController.js
export const getAppEventImages = async (req, res) => {
  const { eventId, page = 1 } = req.query;
  const pageSize = 25; // Limit to 25 images per page

  if (!eventId) {
    return res.status(400).json({ error: "Missing eventId" });
  }

  const prefix = `eventimages/${eventId}/images/`;

  let allItems = [];
  let continuationToken;

  try {
    do {
      const listCommand = new ListObjectsV2Command({
        Bucket: process.env.BUCKET_NAME,
        Prefix: prefix,
        MaxKeys: 1000, // Fetch up to 1000 items at once; we paginate manually
        ContinuationToken: continuationToken,
      });

      const response = await s3Client.send(listCommand);
      allItems = [...allItems, ...(response.Contents || [])];
      continuationToken = response.IsTruncated
        ? response.NextContinuationToken
        : null;
    } while (continuationToken);

    // Sort items by LastModified date (newest first)
    const sortedItems = allItems.sort(
      (a, b) => new Date(b.LastModified) - new Date(a.LastModified)
    );

    // Calculate the range of items to be returned for the requested page
    const startIndex = (page - 1) * pageSize;
    const paginatedItems = sortedItems.slice(startIndex, startIndex + pageSize);

    // Generate signed URLs for the images
    const imageUrls = await Promise.all(
      paginatedItems.map(async (item) => {
        const getCommand = new GetObjectCommand({
          Bucket: process.env.BUCKET_NAME,
          Key: item.Key,
        });
        return getSignedUrl(s3Client, getCommand, { expiresIn: 3600 });
      })
    );

    // Return the paginated image URLs to the client
    res.status(200).json({
      images: imageUrls,
      hasNextPage: paginatedItems.length === pageSize, // Indicates if there are more images to load
    });
  } catch (err) {
    console.error("Error fetching images:", err);
    res.status(500).json({ error: "Could not retrieve images" });
  }
};
