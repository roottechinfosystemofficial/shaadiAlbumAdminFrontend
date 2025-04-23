import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from "dotenv";
import sharp from "sharp";

dotenv.config();

const s3Client = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.ACCESSID,
    secretAccessKey: process.env.SECRETACCESSKEY,
  },
});

const BATCH_SIZE = 50;
const MAX_FILE_SIZE_MB = 10;

const MAX_FILE_SIZE_MB = 10; // 10 MB limit in the backend

export const getPresignedUrl = async (req, res) => {
  const { files, eventId } = req.body;

  if (!files || !Array.isArray(files) || !eventId) {
    return res.status(400).json({ error: "Missing files or eventId" });
  }

  const timestamp = Date.now(); // capture timestamp once to keep order

  // Function to generate the pre-signed URLs in batches
  const generateBatchUrls = async (files, eventId) => {
    const batches = [];
    for (let i = 0; i < files.length; i += BATCH_SIZE) {
      const batch = files.slice(i, i + BATCH_SIZE);
      batches.push(batch);
    }

    // Initialize an empty array to store all signed URLs
    let signedUrls = [];

    // Process each batch
    for (const batch of batches) {
      const batchUrls = await Promise.all(
        batch.map(async ({ fileName, fileType, fileSize }, index) => {
          // Ensure the file size doesn't exceed the limit
          if (fileSize > MAX_FILE_SIZE_MB * 1024 * 1024) {
            // size in bytes
            throw new Error(
              `File ${fileName} exceeds the size limit of ${MAX_FILE_SIZE_MB} MB.`
            );
          }

          const uniqueKey = `eventimages/${eventId}/images/${timestamp}-${index}-${fileName}`;
          const command = new PutObjectCommand({
            Bucket: process.env.BUCKET_NAME,
            Key: uniqueKey,
            ContentType: fileType,
          });

          // Get the pre-signed URL
          const url = await getSignedUrl(s3Client, command);

          // Add to signedUrls array
          return { url, key: uniqueKey, fileName };
        })
      );
      // Append the batch URLs to the signedUrls array
      signedUrls = [...signedUrls, ...batchUrls];
    }

    return signedUrls;
  };

  try {
    const signedUrls = await generateBatchUrls(files, eventId);
    console.log(signedUrls.length);

    // Respond with the generated URLs
    res.status(200).json({ urls: signedUrls });
  } catch (err) {
    console.error("Error generating batch signed URLs:", err);
    res.status(500).json({ error: "Could not generate signed URLs" });
  }
};

export const getEventImages = async (req, res) => {
  const { eventId, continuationToken } = req.query;
  const pageSize = 10;

  if (!eventId) {
    return res.status(400).json({ error: "Missing eventId" });
  }

  try {
    const listCommand = new ListObjectsV2Command({
      Bucket: process.env.BUCKET_NAME,
      Prefix: `eventimages/${eventId}/images/`,
      MaxKeys: pageSize,
      ContinuationToken: continuationToken || undefined,
    });

    const response = await s3Client.send(listCommand);

    const imageUrls = await Promise.all(
      (response.Contents || []).map(async (item) => {
        const getCommand = new GetObjectCommand({
          Bucket: process.env.BUCKET_NAME,
          Key: item.Key,
        });
        return getSignedUrl(s3Client, getCommand);
      })
    );
    console.log(imageUrls.length);

    res.status(200).json({
      images: imageUrls,
      nextToken: response.NextContinuationToken || null,
    });
  } catch (err) {
    console.error("Error fetching paginated images:", err);
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

    // Generate signed URLs for the images and resize them
    const imageUrls = await Promise.all(
      paginatedItems.map(async (item) => {
        const getCommand = new GetObjectCommand({
          Bucket: process.env.BUCKET_NAME,
          Key: item.Key,
        });

        // Fetch image from S3
        const image = await s3Client.send(getCommand);

        // Resize and compress the image using Sharp
        const resizedImage = await sharp(image.Body)
          .resize(800) // Resize to width 800px (you can adjust this based on your needs)
          .jpeg({ quality: 50 }) // Reduce quality to 50 (you can adjust as needed)
          .toBuffer();

        // Upload the resized image to S3 or return it directly
        const resizedKey = `resized/${item.Key}`; // Save the resized image with a new name (optional)

        // (Optional) You could upload the resized image back to S3 if you want to keep it
        // await s3Client.send(new PutObjectCommand({
        //   Bucket: process.env.BUCKET_NAME,
        //   Key: resizedKey,
        //   Body: resizedImage,
        // }));

        // Generate signed URL for the resized image
        const resizedImageUrl = await getSignedUrl(s3Client, getCommand, {
          expiresIn: 3600,
        });

        return resizedImageUrl;
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
