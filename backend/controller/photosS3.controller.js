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
  const { files, eventId, subEventId, usageType, flipbookId } = req.body;
  console.log(req.body);

  // Validate inputs
  if (!files || !Array.isArray(files) || !eventId) {
    return res.status(400).json({ error: "Missing files or eventId" });
  }

  if (usageType === "flipbook" && !flipbookId) {
    return res
      .status(400)
      .json({ error: "Missing flipbookId for flipbook usage" });
  }

  if (usageType !== "flipbook" && !subEventId) {
    return res
      .status(400)
      .json({ error: "Missing subEventId for event usage" });
  }

  const timestamp = Date.now();
  const signedUrls = [];
  const failedFiles = [];

  try {
    const urlPromises = files.map(async (file, index) => {
      const { fileName, fileType } = file;

      try {
        const fileExt = fileName.includes(".")
          ? fileName.substring(fileName.lastIndexOf("."))
          : ".jpg";
        const baseName = fileName.substring(0, fileName.lastIndexOf("."));

        const folder =
          usageType === "flipbook" ? "flipbookimages" : "eventimages";
        const middleId = usageType === "flipbook" ? flipbookId : subEventId;

        const uniqueKey = `${folder}/${eventId}/${middleId}/Orignal/${timestamp}_${index}_${baseName}${fileExt}`;

        const command = new PutObjectCommand({
          Bucket: process.env.BUCKET_NAME,
          Key: uniqueKey,
          ContentType: fileType,
        });

        const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

        return { url, key: uniqueKey, fileName };
      } catch (err) {
        console.error(`Error generating URL for ${fileName}:`, err);
        return {
          fileName,
          reason: "Internal error generating URL",
        };
      }
    });

    const results = await Promise.all(urlPromises);

    results.forEach((result) => {
      if (result.url) {
        signedUrls.push(result);
      } else {
        failedFiles.push(result);
      }
    });

    if (signedUrls.length === 0) {
      return res.status(500).json({
        error: "Failed to generate any signed URLs",
        failedFiles,
      });
    }

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
  const { eventId, continuationToken, usageType, subEventId, flipbookId } =
    req.body;
  const pageSize = 200;

  // Validate required parameters
  if (!eventId) {
    return res.status(400).json({ error: "Missing eventId" });
  }

  if (usageType === "flipbook" && !flipbookId) {
    return res
      .status(400)
      .json({ error: "Missing flipbookId for flipbook usage" });
  }

  if (usageType !== "flipbook" && !subEventId) {
    return res
      .status(400)
      .json({ error: "Missing subEventId for event usage" });
  }

  try {
    // Determine the correct prefix based on usageType
    const prefix =
      usageType === "flipbook"
        ? `flipbookimages/${eventId}/${flipbookId}/`
        : `eventimages/${eventId}/${subEventId}/Orignal`;

    const listCommand = new ListObjectsV2Command({
      Bucket: process.env.BUCKET_NAME,
      Prefix: prefix,
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
    // Fetch all image objects
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

        // Resize and compress thumbnail within 200KB
        const MAX_THUMBNAIL_SIZE = 200 * 1024;
        let quality = 90;
        let thumbnailBuffer;

        do {
          thumbnailBuffer = await sharp(buffer)
            .resize(800)
            .jpeg({ quality })
            .toBuffer();

          if (thumbnailBuffer.length <= MAX_THUMBNAIL_SIZE || quality <= 30)
            break;
          quality -= 5;
        } while (true);

        // Derive thumbnail key (1 folder up, insert "thumbs")
        const pathParts = item.Key.split("/");
        const fileName = pathParts.pop();
        const thumbKey = [...pathParts.slice(0, -1), "thumbs", fileName].join(
          "/"
        );

        // Upload thumbnail to S3
        const putCommand = new PutObjectCommand({
          Bucket: process.env.BUCKET_NAME,
          Key: thumbKey,
          Body: thumbnailBuffer,
          ContentType: "image/jpeg",
        });

        await s3Client.send(putCommand);

        // Get signed URL for thumbnail
        const thumbnailUrl = await getSignedUrl(
          s3Client,
          new GetObjectCommand({
            Bucket: process.env.BUCKET_NAME,
            Key: thumbKey,
          })
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
