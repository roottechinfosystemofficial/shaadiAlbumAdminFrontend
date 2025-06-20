import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from "dotenv";
import sharp from "sharp";
import FlipBook from "../model/FlipBook.model.js";
import Event from "../model/Event.model.js";
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

console.log("amazon s3 cred",process.env.ACCESSID,process.env.SECRETACCESSKEY,process.env.BUCKET_NAME)

export const getPresignedUrl = async (req, res) => {
  const { files, eventId, subEventId, usageType, flipbookId } = req.body;

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
      const { fileName, fileType, path } = file;

      // Check if this file is a thumbnail or not by checking the path or fileName
      const isThumbnail = path && path.includes("thumbnails");

      try {
        const fileExt = fileName.includes(".")
          ? fileName.substring(fileName.lastIndexOf("."))
          : ".jpg";
        const baseName = fileName.substring(0, fileName.lastIndexOf("."));

        // Define the folder for storage based on whether it's a flipbook or event
        const folder =
          usageType === "flipbook" ? "flipbookimages" : "eventimages";
        const middleId = usageType === "flipbook" ? flipbookId : subEventId;

        // Determine whether the file is a thumbnail or not and assign appropriate folder
        const storageFolder = isThumbnail ? "Thumbnails" : "Original";

        // Construct the unique key for storage using the same base name for both
        const uniqueKey = `${folder}/${eventId}/${middleId}/${storageFolder}/${timestamp}_${baseName}${fileExt}`;

        // Generate the presigned URL for this file
        const command = new PutObjectCommand({
          Bucket: process.env.BUCKET_NAME,
          Key: uniqueKey,
          ContentType: fileType || "image/jpeg"
        });

        const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

        console.log("upload to s3 successful")

        return { url, key: uniqueKey, fileName };
      } catch (err) {
        console.error(`Error generating URL for ${fileName}:`, err);
        return {
          fileName,
          reason: "Internal error generating URL",
        };
      }
    });

    // Wait for all promises to resolve
    const results = await Promise.all(urlPromises);

    // Process the results and separate failed files
    results.forEach((result) => {
      if (result.url) {
        signedUrls.push(result);
      } else {
        failedFiles.push(result);
      }
    });

    // If no URLs were successfully generated, return an error
    if (signedUrls.length === 0) {
      return res.status(500).json({
        error: "Failed to generate any signed URLs",
        failedFiles,
      });
    }

    // Return the successfully generated URLs
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

// export const getEventImages = async (req, res) => {
//   const { eventId, continuationToken, usageType, subEventId, flipbookId } =
//     req.body;
//   const pageSize = 20;

//   // Validate required parameters
//   if (!eventId) {
//     return res.status(400).json({ error: "Missing eventId" });
//   }

//   if (usageType === "flipbook" && !flipbookId) {
//     return res
//       .status(400)
//       .json({ error: "Missing flipbookId for flipbook usage" });
//   }

//   if (usageType !== "flipbook" && !subEventId) {
//     return res
//       .status(400)
//       .json({ error: "Missing subEventId for event usage" });
//   }

//   try {
//     let prefix = "";

//     // For flipbook images, we fetch images from the flipbook folder
//     if (usageType === "flipbook") {
//       prefix = `flipbookimages/${eventId}/${flipbookId}/`;
//     } else {
//       // For event images, we will explicitly fetch images from both 'Original' and 'Thumbnails' folders
//       prefix = `eventimages/${eventId}/${subEventId}/`;
//     }

//     let allContents = [];
//     let nextToken = continuationToken || undefined;

//     // Loop to fetch images in chunks if more images exist
//     do {
//       const listCommand = new ListObjectsV2Command({
//         Bucket: process.env.BUCKET_NAME,
//         Prefix: prefix,
//         MaxKeys: pageSize, // limit to 20 per request
//         ContinuationToken: nextToken,
//       });

//       const response = await s3Client.send(listCommand);
//       allContents.push(...(response.Contents || []));
//       nextToken = response.NextContinuationToken;
//     } while (nextToken); // Continue fetching if there's more data

//     // Fetch signed URLs and classify images into Original and Thumbnails
//     const imageUrls = await Promise.all(
//       allContents.map(async (item) => {
//         const parts = item.Key.split("/");
//         const filename = parts[parts.length - 1];
//         const folder = parts[parts.length - 2]; // Folder name will be either 'Original' or 'Thumbnails'

//         // Check if the image is from the 'Original' or 'Thumbnails' folder
//         if (folder === "Original" || folder === "Thumbnails") {
//           const getCommand = new GetObjectCommand({
//             Bucket: process.env.BUCKET_NAME,
//             Key: item.Key,
//           });

//           const url = await getSignedUrl(s3Client, getCommand);
//           return { url, key: item.Key, filename, folder };
//         }
//         return null;
//       })
//     );
//     // console.log(imageUrls.length);

//     // Filter out null values in case some files are not categorized under 'Original' or 'Thumbnails'
//     const validImageUrls = imageUrls.filter((img) => img !== null);
//     console.log(validImageUrls.length);

//     // Separate images into original and thumbnails
//     const originalImagesMap = {};
//     const thumbnailImagesMap = {};

//     validImageUrls.forEach((img) => {
//       if (img.folder === "Original") {
//         originalImagesMap[img.filename] = img.url;
//       } else if (img.folder === "Thumbnails") {
//         thumbnailImagesMap[img.filename] = img.url;
//       }
//     });

//     // Combine original and thumbnail URLs by filename
//     const matchedImages = Object.keys(thumbnailImagesMap).map((filename) => ({
//       filename,
//       thumbnailUrl: thumbnailImagesMap[filename],
//       originalUrl: originalImagesMap[filename] || thumbnailImagesMap[filename], // fallback if original missing
//     }));

//     res.status(200).json({
//       images: matchedImages,
//       nextToken: nextToken || null, // provide the next token if there's more data
//     });
//   } catch (err) {
//     console.error("Error fetching images:", err);
//     res.status(500).json({ error: "Could not retrieve images" });
//   }
// };

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

export const getEventImages = async (req, res) => {
  const {
    eventId,
    subEventId,
    continuationTokenOriginal,
    continuationTokenThumbs,
  } = req.body;

  if (!eventId || !subEventId) {
    return res.status(400).json({ error: "Missing eventId or subEventId" });
  }

  try {
    const basePrefix = `eventimages/${eventId}/${subEventId}/`;
    const pageSize = 20;

    const fetchFolderItems = async (folder, token) => {
      const prefix = `${basePrefix}${folder}/`;
      const listCommand = new ListObjectsV2Command({
        Bucket: process.env.BUCKET_NAME,
        Prefix: prefix,
        MaxKeys: pageSize,
        ContinuationToken: token || undefined,
      });

      const response = await s3Client.send(listCommand);

      const items = await Promise.all(
        (response.Contents || []).map(async (item) => {
          const filename = item.Key.split("/").pop();
          const getCommand = new GetObjectCommand({
            Bucket: process.env.BUCKET_NAME,
            Key: item.Key,
          });
          const url = await getSignedUrl(s3Client, getCommand);
          return { filename, url };
        })
      );

      return { items, nextToken: response.NextContinuationToken || null };
    };

    const [originalData, thumbData] = await Promise.all([
      fetchFolderItems("Original", continuationTokenOriginal),
      fetchFolderItems("Thumbs", continuationTokenThumbs),
    ]);

    const originalMap = {};
    originalData.items.forEach((img) => {
      originalMap[img.filename.toLowerCase()] = img.url;
    });

    const thumbMap = {};
    thumbData.items.forEach((img) => {
      thumbMap[img.filename.toLowerCase()] = img.url;
    });

    const allFilenames = new Set([
      ...Object.keys(originalMap),
      ...Object.keys(thumbMap),
    ]);

    const merged = Array.from(allFilenames)
      .filter((f) => originalMap[f] && thumbMap[f])
      .map((f) => ({
        filename: f,
        originalUrl: originalMap[f],
        thumbnailUrl: thumbMap[f],
      }));

    return res.status(200).json({
      images: merged,
      nextTokenOriginal: originalData.nextToken,
      nextTokenThumbs: thumbData.nextToken,
    });
  } catch (err) {
    console.error("Error fetching event images:", err);
    res.status(500).json({ error: "Could not retrieve event images" });
  }
};

export const getFlipbookImages = async (req, res) => {
  const { eventId, flipbookId } = req.body;

  if (!eventId || !flipbookId) {
    return res.status(400).json({ error: "Missing eventId or flipbookId" });
  }

  try {
    const prefix = `flipbookimages/${eventId}/${flipbookId}/`;
    const allImages = [];
    let continuationToken = undefined;

    do {
      const listCommand = new ListObjectsV2Command({
        Bucket: process.env.BUCKET_NAME,
        Prefix: prefix,
        MaxKeys: 1000,
        ContinuationToken: continuationToken,
      });

      const response = await s3Client.send(listCommand);

      const imageUrls = await Promise.all(
        (response.Contents || []).map(async (item) => {
          const getCommand = new GetObjectCommand({
            Bucket: process.env.BUCKET_NAME,
            Key: item.Key,
          });
          const url = await getSignedUrl(s3Client, getCommand);
          return url;
        })
      );

      allImages.push(...imageUrls);
      continuationToken = response.IsTruncated
        ? response.NextContinuationToken
        : undefined;
    } while (continuationToken);

    return res.status(200).json({
      images: allImages,
    });
  } catch (err) {
    console.error("Error fetching flipbook images:", err);
    res.status(500).json({ error: "Could not retrieve flipbook images" });
  }
};


export const getFlipbookImagesByEventId = async (req, res) => {
  const { eventID } = req.params ;
  console.log("===========>",req.params )
  if (!eventID) {
    return res.status(400).json({ error: "event code is required" });
  }

  try {
    const eventData = await Event.findOne({ _id: eventID });
    if (!eventData) {
      return res.status(404).json({ error: "event not found" });
    }

    const flipBooks = await FlipBook.find({ eventCode: eventData.eventCode });

    if (!flipBooks || flipBooks.length === 0) {
      return res.status(404).json({ error: "FlipBook data not found" });
    }

    const allImages = [];

    for (const flipBook of flipBooks) {
      const prefix = `flipbookimages/${eventID}/${flipBook._id.toString()}/`;
      let continuationToken = undefined;

      do {
        const listCommand = new ListObjectsV2Command({
          Bucket: process.env.BUCKET_NAME,
          Prefix: prefix,
          MaxKeys: 1000,
          ContinuationToken: continuationToken,
        });

        const response = await s3Client.send(listCommand);

        const imageUrls = await Promise.all(
          (response.Contents || []).map(async (item) => {
            const getCommand = new GetObjectCommand({
              Bucket: process.env.BUCKET_NAME,
              Key: item.Key,
            });
            const url = await getSignedUrl(s3Client, getCommand);
            return url;
          })
        );

        allImages.push(...imageUrls);

        continuationToken = response.IsTruncated
          ? response.NextContinuationToken
          : undefined;
      } while (continuationToken);
    }

    return res.status(200).json({ images: allImages });
  } catch (err) {
    console.error("Error fetching flipbook images:", err);
    res.status(500).json({ error: "Could not retrieve flipbook images" });
  }
};




export const getCoverImage = async (req, res) => {
  const { eventId, subEventId } = req.query;

  if (!eventId || !subEventId) {
    return res.status(400).json({ error: "Missing eventId or subEventId" });
  }

  const prefix = `eventimages/${eventId}/${subEventId}/Original/`;

  try {
    let continuationToken;
    let allItems = [];

    // List all items under the "Original" folder
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

    if (allItems.length === 0) {
      return res.status(404).json({ error: "No images found for this event." });
    }

    // Sort by most recent
    const sortedItems = allItems.sort(
      (a, b) => new Date(b.LastModified) - new Date(a.LastModified)
    );

    // Get the latest image
    const latestImage = sortedItems[0];

    const signedUrl = await getSignedUrl(
      s3Client,
      new GetObjectCommand({
        Bucket: process.env.BUCKET_NAME,
        Key: latestImage.Key,
      }),
      { expiresIn: 3600 }
    );

    return res.status(200).json({
      key: latestImage.Key,
      url: signedUrl,
    });
  } catch (err) {
    console.error("Error getting cover image:", err);
    return res.status(500).json({ error: "Failed to retrieve cover image" });
  }
};
