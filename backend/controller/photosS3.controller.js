import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from "dotenv";
import sharp from "sharp";
// import ImageModel from "../model/ImageMetadata.js";

dotenv.config();
const streamToBuffer = async (stream) => {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("end", () => resolve(Buffer.concat(chunks)));
    stream.on("error", reject);
  });
};
const s3Client = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.ACCESSID,
    secretAccessKey: process.env.SECRETACCESSKEY,
  },
});

export const getPresignedUrl = async (req, res) => {
  const { files, eventId, subEventId } = req.body;

  // Validate the request body
  if (!files || !Array.isArray(files) || !eventId || !subEventId) {
    return res
      .status(400)
      .json({ error: "Missing files, eventId, or subEventId" });
  }

  const timestamp = Date.now();
  const signedUrls = [];
  const failedFiles = [];

  // Process each file in the request
  try {
    const urlPromises = files.map(async (file, index) => {
      const { fileName, fileType } = file;

      try {
        // Ensure the file has an extension
        const fileExt = fileName.includes(".")
          ? fileName.substring(fileName.lastIndexOf("."))
          : ".jpg"; // Default to .jpg if no extension
        const baseName = fileName.substring(0, fileName.lastIndexOf("."));

        // Create a unique key with timestamp, eventId, subEventId, and index
        const uniqueKey = `eventimages/${eventId}/${subEventId}/${timestamp}_${index}_${baseName}${fileExt}`;

        // Prepare the command to get the presigned URL
        const command = new PutObjectCommand({
          Bucket: process.env.BUCKET_NAME,
          Key: uniqueKey,
          ContentType: fileType,
        });

        // Get the presigned URL
        const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

        // Push the signed URL and key to the response data
        return { url, key: uniqueKey, fileName };
      } catch (err) {
        console.error(`Error generating URL for ${fileName}:`, err);
        return {
          fileName,
          reason: "Internal error generating URL",
        };
      }
    });

    // Resolve all file promises
    const results = await Promise.all(urlPromises);

    // Separate successful URLs from failed files
    results.forEach((result) => {
      if (result.url) {
        signedUrls.push(result);
      } else {
        failedFiles.push(result);
      }
    });

    // If no signed URLs were generated, return an error
    if (signedUrls.length === 0) {
      return res.status(500).json({
        error: "Failed to generate any signed URLs",
        failedFiles,
      });
    }

    // Return the signed URLs and any failed files
    return res.status(200).json({
      urls: signedUrls,
      failedFiles,
    });
  } catch (err) {
    console.error("Unexpected error during URL generation:", err);
    return res
      .status(500)
      .json({ error: "Unexpected error during URL generation" });
  }
};

export const getEventImages = async (req, res) => {
  const { eventId, continuationToken, subEventId } = req.body;
  const pageSize = 200;

  if (!eventId) {
    return res.status(400).json({ error: "Missing eventId" });
  }

  try {
    const listCommand = new ListObjectsV2Command({
      Bucket: process.env.BUCKET_NAME,
      Prefix: `eventimages/${eventId}/${subEventId}/`,
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

export const getAppEventImages = async (req, res) => {
  const { eventId, page = 1, subEventId } = req.query;
  const pageSize = 25;

  if (!eventId) {
    return res.status(400).json({ error: "Missing eventId" });
  }

  const prefix = `eventimages/${eventId}/${subEventId}/`;

  let allItems = [];
  let continuationToken;

  try {
    do {
      const listCommand = new ListObjectsV2Command({
        Bucket: process.env.BUCKET_NAME,
        Prefix: prefix,
        MaxKeys: 1000,
        ContinuationToken: continuationToken,
      });

      const response = await s3Client.send(listCommand);
      allItems = [...allItems, ...(response.Contents || [])];
      continuationToken = response.IsTruncated
        ? response.NextContinuationToken
        : null;
    } while (continuationToken);

    // Filter out thumbnails
    const imageItems = allItems.filter(
      (item) => !item.Key.includes("/thumbs/")
    );

    const sortedItems = imageItems.sort(
      (a, b) => new Date(b.LastModified) - new Date(a.LastModified)
    );

    const startIndex = (page - 1) * pageSize;
    const paginatedItems = sortedItems.slice(startIndex, startIndex + pageSize);

    const images = await Promise.all(
      paginatedItems.map(async (item) => {
        const originalCommand = new GetObjectCommand({
          Bucket: process.env.BUCKET_NAME,
          Key: item.Key,
        });

        const originalUrl = await getSignedUrl(s3Client, originalCommand, {
          expiresIn: 3600,
        });

        // Get image buffer
        const image = await s3Client.send(originalCommand);
        const buffer = await streamToBuffer(image.Body);

        // Resize for thumbnail
        const thumbnailBuffer = await sharp(buffer)
          .resize(800)
          .jpeg({ quality: 90 })
          .toBuffer();

        // Derive thumbnail key (insert "thumbs" just before filename)
        const pathParts = item.Key.split("/");
        const fileName = pathParts.pop(); // Get file name
        const thumbKey = [...pathParts.slice(0, -1), "thumbs", fileName].join(
          "/"
        );

        // Upload thumbnail
        const putCommand = new PutObjectCommand({
          Bucket: process.env.BUCKET_NAME,
          Key: thumbKey,
          Body: thumbnailBuffer,
          ContentType: "image/jpeg",
        });

        await s3Client.send(putCommand);

        // Generate thumbnail URL
        const thumbnailUrl = await getSignedUrl(
          s3Client,
          new GetObjectCommand({
            Bucket: process.env.BUCKET_NAME,
            Key: thumbKey,
          }),
          { expiresIn: 3600 }
        );

        return {
          id: item.Key,
          originalUrl,
          thumbnailUrl,
        };
      })
    );

    res.status(200).json({
      images,
      hasNextPage: paginatedItems.length === pageSize,
    });
  } catch (err) {
    console.error("Error fetching images:", err);
    res.status(500).json({ error: "Could not retrieve images" });
  }
};

// 🔹 Get Total Image Count for an Event
export const getEventImageCount = async (req, res) => {
  const { eventId } = req.query;

  if (!eventId) {
    return res.status(400).json({ error: "Missing eventId" });
  }

  const prefix = `eventimages/${eventId}/`;

  let totalCount = 0;
  let continuationToken;

  try {
    do {
      const listCommand = new ListObjectsV2Command({
        Bucket: process.env.BUCKET_NAME,
        Prefix: prefix,
        MaxKeys: 1000,
        ContinuationToken: continuationToken,
      });

      const response = await s3Client.send(listCommand);

      const imageFiles = (response.Contents || []).filter((item) =>
        item.Key.match(/\.(jpg|jpeg|png|gif|webp)$/i)
      );

      totalCount += imageFiles.length;
      continuationToken = response.IsTruncated
        ? response.NextContinuationToken
        : null;
    } while (continuationToken);

    res.status(200).json({ imageCount: totalCount });
  } catch (err) {
    console.error("Error counting images in S3:", err);
    res.status(500).json({ error: "Could not count images" });
  }
};

// export const getPresignedUrl = async (req, res) => {
//   try {
//     const { files } = req.body; // array of { key, type }
//     console.log(files);

//     if (!files || !Array.isArray(files)) {
//       return res.status(400).json({ message: "Invalid files array" });
//     }

//     const urls = await Promise.all(
//       files.map(async ({ key }) => {
//         const command = new PutObjectCommand({
//           Bucket: process.env.BUCKET_NAME,
//           Key: key,
//           ContentType: "image/jpeg",
//         });

//         const url = await getSignedUrl(s3Client, command, { expiresIn: 300 }); // 5 mins
//         return { key, url };
//       })
//     );

//     res.status(200).json({ urls });
//   } catch (error) {
//     console.error("Presigned URL Error:", error);
//     res.status(500).json({ message: "Error generating presigned URLs" });
//   }
// };

// export const getEventImages = async (req, res) => {
//   try {
//     const { eventId } = req.params;

//     const images = await ImageModel.find({ eventId });

//     const signedUrls = await Promise.all(
//       images.map(async (img) => {
//         const command = new GetObjectCommand({
//           Bucket: process.env.BUCKET_NAME,
//           Key: img.thumbnailImageKey,
//         });

//         const url = await getSignedUrl(s3Client, command);
//         return url;
//       })
//     );

//     res.status(200).json({ urls: signedUrls });
//   } catch (error) {
//     console.error("Failed to get images", error);
//     res.status(500).json({ message: "Failed to get images" });
//   }
// };
