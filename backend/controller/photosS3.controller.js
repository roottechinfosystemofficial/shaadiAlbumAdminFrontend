import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  DeleteObjectCommand,
  DeleteObjectsCommand
  
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from "dotenv";
import sharp from "sharp";
import FlipBook from "../model/FlipBook.model.js";
import Event from "../model/Event.model.js";
import {
  RekognitionClient,
  SearchFacesByImageCommand,
  ListCollectionsCommand,
  CreateCollectionCommand,
  IndexFacesCommand,
  DetectFacesCommand

} from "@aws-sdk/client-rekognition";
// import ImageModel from "../model/ImageMetadata.js";
import {
  getActiveSubscription,
  checkStorageLimit,
  updateStorageUsed,
} from "../utils/planChecks.js";


dotenv.config();
// const streamToBuffer = async (stream) => {
//   return new Promise((resolve, reject) => {
//     const chunks = [];
//     stream.on("data", (chunk) => chunks.push(chunk));
//     stream.on("end", () => resolve(Buffer.concat(chunks)));
//     stream.on("error", reject);
//   });
// };
 export const s3Client = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.ACCESSID,
    secretAccessKey: process.env.SECRETACCESSKEY,
  },
});
const rekognitionClient = new RekognitionClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.ACCESSID,
    secretAccessKey: process.env.SECRETACCESSKEY,
  },
});

console.log("amazon s3 cred",process.env.ACCESSID,process.env.SECRETACCESSKEY,process.env.BUCKET_NAME)

// export const getPresignedUrl = async (req, res) => {
//   const { files, eventId, subEventId, usageType, flipbookId } = req.body;

//   // Validate inputs
//   if (!files || !Array.isArray(files) || !eventId) {
//     return res.status(400).json({ error: "Missing files or eventId" });
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

//   const timestamp = Date.now();
//   const signedUrls = [];
//   const failedFiles = [];

//   try {
//     const urlPromises = files.map(async (file, index) => {
//       const { fileName, fileType, path } = file;

//       // Check if this file is a thumbnail or not by checking the path or fileName
//       const isThumbnail = path && path.includes("thumbnails");

//       try {
//         const fileExt = fileName.includes(".")
//           ? fileName.substring(fileName.lastIndexOf("."))
//           : ".jpg";
//         const baseName = fileName.substring(0, fileName.lastIndexOf("."));

//         // Define the folder for storage based on whether it's a flipbook or event
//         const folder =
//           usageType === "flipbook" ? "flipbookimages" : "eventimages";
//         const middleId = usageType === "flipbook" ? flipbookId : subEventId;

//         // Determine whether the file is a thumbnail or not and assign appropriate folder
//         const storageFolder = isThumbnail ? "Thumbnails" : "Original";

//         // Construct the unique key for storage using the same base name for both
//         const uniqueKey = `${folder}/${eventId}/${middleId}/${storageFolder}/${timestamp}_${baseName}${fileExt}`;

//         // Generate the presigned URL for this file
//         const command = new PutObjectCommand({
//           Bucket: process.env.BUCKET_NAME,
//           Key: uniqueKey,
//           ContentType: fileType || "image/jpeg"
//         });

//         const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

//         console.log("upload to s3 successful")

//         return { url, key: uniqueKey, fileName };
//       } catch (err) {
//         console.error(`Error generating URL for ${fileName}:`, err);
//         return {
//           fileName,
//           reason: "Internal error generating URL",
//         };
//       }
//     });

//     // Wait for all promises to resolve
//     const results = await Promise.all(urlPromises);

//     // Process the results and separate failed files
//     results.forEach((result) => {
//       if (result.url) {
//         signedUrls.push(result);
//       } else {
//         failedFiles.push(result);
//       }
//     });

//     // If no URLs were successfully generated, return an error
//     if (signedUrls.length === 0) {
//       return res.status(500).json({
//         error: "Failed to generate any signed URLs",
//         failedFiles,
//       });
//     }

//     // Return the successfully generated URLs
//     return res.status(200).json({
//       urls: signedUrls,
//       failedFiles,
//     });
//   } catch (err) {
//     console.error("Unexpected error during URL generation:", err);
//     return res
//       .status(500)
//       .json({ error: "Unexpected error during URL generation" });
//   }
// };

// export const getPresignedUrl = async (req, res) => {
//   const { files, eventId, subEventId, usageType, flipbookId } = req.body;

//   if (!files || !Array.isArray(files) || !eventId) {
//     return res.status(400).json({ error: "Missing files or eventId" });
//   }

//   if (usageType === "flipbook" && !flipbookId) {
//     return res.status(400).json({ error: "Missing flipbookId for flipbook usage" });
//   }

//   if (usageType !== "flipbook" && !subEventId) {
//     return res.status(400).json({ error: "Missing subEventId for event usage" });
//   }

//   const timestamp = Date.now();
//   const signedUrls = [];
//   const failedFiles = [];

//   try {
//     const results = await Promise.all(
//       files.map(async (file) => {
//         const { fileName, fileType, path } = file;
//         const isThumbnail = path?.toLowerCase().includes("thumbnails");

//         try {
//           const fileExt = fileName.includes(".")
//             ? fileName.substring(fileName.lastIndexOf("."))
//             : ".jpg";
//           const baseName = fileName.substring(0, fileName.lastIndexOf("."));

//           const folder = usageType === "flipbook" ? "flipbookimages" : "eventimages";
//           const middleId = usageType === "flipbook" ? flipbookId : subEventId;
//           const storageFolder = isThumbnail ? "Thumbnails" : "Original";
//           const uniqueKey = `${folder}/${eventId}/${middleId}/${storageFolder}/${timestamp}_${baseName}${fileExt}`;

//           const command = new PutObjectCommand({
//             Bucket: process.env.BUCKET_NAME,
//             Key: uniqueKey,
//             ContentType: fileType || "image/jpeg",
//           });

//           const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

//           // 🔍 Index face in Rekognition only for original event images
//           if (!isThumbnail && usageType !== "flipbook") {
//             try {
//               // const indexCommand = new IndexFacesCommand({
//               //   CollectionId: eventId,
//               //   Image: {
//               //     S3Object: {
//               //       Bucket: process.env.BUCKET_NAME,
//               //       Name: uniqueKey,
//               //     },
//               //   },
//               //   ExternalImageId: `${timestamp}_${baseName}`,
//               //   DetectionAttributes: [],
//               // });

//               // await rekognitionClient.send(indexCommand);
//               console.log(`✅ Indexed face for ${fileName}`);
//             } catch (indexErr) {
//               console.warn(`⚠️ Failed to index face for ${fileName}:`, indexErr);
//             }
//           }

//           return { url, key: uniqueKey, fileName };
//         } catch (err) {
//           console.error(`Error generating URL for ${fileName}:`, err);
//           return { fileName, reason: "Internal error generating URL" };
//         }
//       })
//     );

//     // Collect results
//     results.forEach((result) => {
//       if (result.url) {
//         signedUrls.push(result);
//       } else {
//         failedFiles.push(result);
//       }
//     });

//     if (signedUrls.length === 0) {
//       return res.status(500).json({
//         error: "Failed to generate any signed URLs",
//         failedFiles,
//       });
//     }

//     return res.status(200).json({
//       urls: signedUrls,
//       failedFiles,
//     });
//   } catch (err) {
//     console.error("Unexpected error during URL generation:", err);
//     return res.status(500).json({ error: "Unexpected error during URL generation" });
//   }
// };
const streamToBuffer = async (readableStream) => {
  const chunks = [];
  for await (const chunk of readableStream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
};

// export const getPresignedUrl = async (req, res) => {
//   const { files, eventId, subEventId, usageType, flipbookId } = req.body;

//   if (!files || !Array.isArray(files) || !eventId) {
//     return res.status(400).json({ error: "Missing files or eventId" });
//   }

//   if (usageType === "flipbook" && !flipbookId) {
//     return res.status(400).json({ error: "Missing flipbookId for flipbook usage" });
//   }

//   if (usageType !== "flipbook" && !subEventId) {
//     return res.status(400).json({ error: "Missing subEventId for event usage" });
//   }

//   const timestamp = Date.now();
//   const signedUrls = [];
//   const failedFiles = [];

//   try {
//     const results = await Promise.all(
//       files.map(async (file) => {
//         const { fileName, fileType, path } = file;
//         const isThumbnail = path?.toLowerCase().includes("thumbnails");

//         try {
//           const fileExt = fileName.includes(".")
//             ? fileName.substring(fileName.lastIndexOf("."))
//             : ".jpg";
//           const baseName = fileName.substring(0, fileName.lastIndexOf("."));

//           const folder = usageType === "flipbook" ? "flipbookimages" : "eventimages";
//           const middleId = usageType === "flipbook" ? flipbookId : subEventId;
//           const storageFolder = isThumbnail ? "Thumbnails" : "Original";
//           const uniqueKey = `${folder}/${eventId}/${middleId}/${storageFolder}/${timestamp}_${baseName}${fileExt}`;

//           // Generate pre-signed URL
//           const command = new PutObjectCommand({
//             Bucket: process.env.BUCKET_NAME,
//             Key: uniqueKey,
//             ContentType: fileType || "image/jpeg",
//           });

//           const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

//           // Optional: Run Rekognition detectFaces after upload (skip thumbnails)
//           let faceDetectionStatus = null;

//           if (!isThumbnail && usageType !== "flipbook") {
//             try {
//               // Simulate immediate post-upload check by calling DetectFaces after upload
//               const getObject = new GetObjectCommand({
//                 Bucket: process.env.BUCKET_NAME,
//                 Key: uniqueKey,
//               });

//               const { Body } = await s3Client.send(getObject);
//               const imageBuffer = await streamToBuffer(Body);

//               const detectCommand = new DetectFacesCommand({
//                 Image: { Bytes: imageBuffer },
//                 Attributes: ["DEFAULT"],
//               });

//               const detectResult = await rekognitionClient.send(detectCommand);
//               const facesDetected = detectResult.FaceDetails.length;

//               if (facesDetected === 0) {
//                 faceDetectionStatus = "❌ No face detected";
//                 console.warn(`⚠️ No face detected in uploaded image: ${fileName}`);
//               } else {
//                 faceDetectionStatus = `✅ Detected ${facesDetected} face(s)`;
//               }

//               // Optional: Index the face (you can re-enable this if needed)
//               // const indexCommand = new IndexFacesCommand({
//               //   CollectionId: eventId,
//               //   Image: {
//               //     S3Object: {
//               //       Bucket: process.env.BUCKET_NAME,
//               //       Name: uniqueKey,
//               //     },
//               //   },
//               //   ExternalImageId: `${timestamp}_${baseName}`,
//               //   DetectionAttributes: [],
//               // });
//               // await rekognitionClient.send(indexCommand);

//             } catch (faceErr) {
//               console.warn(`⚠️ Rekognition detect failed for ${fileName}:`, faceErr.message);
//               faceDetectionStatus = "⚠️ Face detection error";
//             }
//           }

//           return { url, key: uniqueKey, fileName, faceDetectionStatus };
//         } catch (err) {
//           console.error(`Error generating URL for ${fileName}:`, err);
//           return { fileName, reason: "Internal error generating URL" };
//         }
//       })
//     );

//     // Process results
//     results.forEach((result) => {
//       if (result.url) {
//         signedUrls.push(result);
//       } else {
//         failedFiles.push(result);
//       }
//     });

//     if (signedUrls.length === 0) {
//       return res.status(500).json({
//         error: "Failed to generate any signed URLs",
//         failedFiles,
//       });
//     }

//     return res.status(200).json({
//       urls: signedUrls,
//       failedFiles,
//     });
//   } catch (err) {
//     console.error("Unexpected error during URL generation:", err);
//     return res.status(500).json({ error: "Unexpected error during URL generation" });
//   }
// };

export const getPresignedUrl = async (req, res) => {
  const { files, eventId, subEventId, usageType, flipbookId, userId } = req.body;

  if (!files || !Array.isArray(files) || !eventId) {
    return res.status(400).json({ error: "Missing files or eventId" });
  }

  const subscription = await getActiveSubscription(userId);
  if (!subscription) {
    return res.status(403).json({ error: "No active subscription found." });
  }

  let totalUploadSize = 0;
  for (const file of files) {
    totalUploadSize += file.size || 0;
  }

  if (!checkStorageLimit(subscription, totalUploadSize)) {
    return res.status(403).json({ error: "Storage limit exceeded." });
  }

  const timestamp = Date.now();
  const signedUrls = [];
  const failedFiles = [];

  try {
    const results = await Promise.all(
      files.map(async (file) => {
        const { fileName, fileType, path } = file;
        const isThumbnail = path?.toLowerCase().includes("thumbnails");

        try {
          const fileExt = fileName.includes(".") ? fileName.substring(fileName.lastIndexOf(".")) : ".jpg";
          const baseName = fileName.substring(0, fileName.lastIndexOf("."));

          const folder = usageType === "flipbook" ? "flipbookimages" : "eventimages";
          const middleId = usageType === "flipbook" ? flipbookId : subEventId;
          const storageFolder = isThumbnail ? "Thumbnails" : "Original";
          const uniqueKey = `${folder}/${eventId}/${middleId}/${storageFolder}/${timestamp}_${baseName}${fileExt}`;

          const command = new PutObjectCommand({
            Bucket: process.env.BUCKET_NAME,
            Key: uniqueKey,
            ContentType: fileType || "image/jpeg",
          });

          const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

          // Optional: Run Rekognition detectFaces after upload (skip thumbnails)
          let faceDetectionStatus = null;

          if (!isThumbnail && usageType !== "flipbook") {
            try {
              const getObject = new GetObjectCommand({
                Bucket: process.env.BUCKET_NAME,
                Key: uniqueKey,
              });

              const { Body } = await s3Client.send(getObject);
              const imageBuffer = await streamToBuffer(Body);

              const detectCommand = new DetectFacesCommand({
                Image: { Bytes: imageBuffer },
                Attributes: ["DEFAULT"],
              });

              const detectResult = await rekognitionClient.send(detectCommand);
              const facesDetected = detectResult.FaceDetails.length;

              faceDetectionStatus = facesDetected === 0
                ? "❌ No face detected"
                : `✅ Detected ${facesDetected} face(s)`;

            } catch (faceErr) {
              faceDetectionStatus = "⚠️ Face detection error";
            }
          }

          return { url, key: uniqueKey, fileName, faceDetectionStatus };
        } catch (err) {
          return { fileName, reason: "Internal error generating URL" };
        }
      })
    );

    results.forEach((result) => {
      if (result.url) signedUrls.push(result);
      else failedFiles.push(result);
    });

    if (signedUrls.length === 0) {
      return res.status(500).json({ error: "Failed to generate any signed URLs", failedFiles });
    }

    // ✅ Update used storage
    await updateStorageUsed(subscription, totalUploadSize);

    return res.status(200).json({ urls: signedUrls, failedFiles });
  } catch (err) {
    return res.status(500).json({ error: "Unexpected error during URL generation" });
  }
};



export const getPresignedUrl2 = async (req, res) => {
  const { files, eventId, subEventId, usageType, flipbookId } = req.body;

  if (!files || !Array.isArray(files) || !eventId) {
    return res.status(400).json({ error: "Missing files or eventId" });
  }

  if (usageType === "flipbook" && !flipbookId) {
    return res.status(400).json({ error: "Missing flipbookId for flipbook usage" });
  }

  if (usageType !== "flipbook" && !subEventId) {
    return res.status(400).json({ error: "Missing subEventId for event usage" });
  }

  const timestamp = Date.now();
  const signedUrls = [];
  const failedFiles = [];

  try {
    const results = await Promise.all(
      files.map(async (file) => {
        const { fileName, fileType, path } = file;
        const isThumbnail = path?.toLowerCase().includes("thumbnails");

        try {
          const fileExt = fileName.includes(".")
            ? fileName.substring(fileName.lastIndexOf("."))
            : ".jpg";
          const baseName = fileName.substring(0, fileName.lastIndexOf("."));

          const folder = usageType === "flipbook" ? "flipbookimages" : "eventimages";
          const middleId = usageType === "flipbook" ? flipbookId : subEventId;
          const storageFolder = isThumbnail ? "Thumbnails" : "Original";
          const uniqueKey = `${folder}/${eventId}/${middleId}/${storageFolder}/${timestamp}_${baseName}${fileExt}`;

          const command = new PutObjectCommand({
            Bucket: process.env.BUCKET_NAME,
            Key: uniqueKey,
            ContentType: fileType || "image/jpeg",
          });

          const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

          return { url, key: uniqueKey, fileName };
        } catch (err) {
          console.error(`Error generating URL for ${fileName}:`, err);
          return { fileName, reason: "Internal error generating URL" };
        }
      })
    );

    results.forEach((result) => {
      if (result.url) {
        signedUrls.push(result);
      } else {
        failedFiles.push(result);
      }
    });

    if (signedUrls.length === 0) {
      return res.status(500).json({ error: "Failed to generate any signed URLs", failedFiles });
    }

    return res.status(200).json({ urls: signedUrls, failedFiles });
  } catch (err) {
    console.error("Unexpected error during URL generation:", err);
    return res.status(500).json({ error: "Unexpected error during URL generation" });
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
          return {
            filename,
            key: item.Key,
            url,
          };
        })
      );

      return {
        items,
        nextToken: response.NextContinuationToken || null,
      };
    };

    // Fetch both folders
    const [originalData, thumbData] = await Promise.all([
      fetchFolderItems("Original", continuationTokenOriginal),
      fetchFolderItems("Thumbs", continuationTokenThumbs),
    ]);

    // Create maps by filename (case-sensitive now)
    const originalMap = {};
    originalData.items.forEach((img) => {
      originalMap[img.filename] = { url: img.url, key: img.key };
    });

    const thumbMap = {};
    thumbData.items.forEach((img) => {
      thumbMap[img.filename] = { url: img.url, key: img.key };
    });

    const allFilenames = new Set([
      ...Object.keys(originalMap),
      ...Object.keys(thumbMap),
    ]);

    const merged = Array.from(allFilenames)
      .filter((filename) => originalMap[filename] && thumbMap[filename])
      .map((filename) => ({
        filename,
        originalUrl: originalMap[filename].url,
        originalKey: originalMap[filename].key,
        thumbnailUrl: thumbMap[filename].url,
        thumbnailKey: thumbMap[filename].key,
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


export const deleteSelectedEventImageSingle = async (req, res) => {
  const { key } = req.body;

  if (!key) {
    return res.status(400).json({ error: "Missing S3 object key" });
  }

  try {
    const deleteCommand = new DeleteObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: key,
    });

    await s3Client.send(deleteCommand);
    return res.status(200).json({ message: "Image deleted successfully", key });
  } catch (err) {
    console.error("Error deleting image:", err);
    return res.status(500).json({ error: "Failed to delete image" });
  }
};


export const deleteMultipleEventImages = async (req, res) => {
  const { keys } = req.body;

  if (!Array.isArray(keys) || keys.length === 0) {
    return res.status(400).json({ error: "No keys provided for deletion" });
  }

  try {
    const deleteCommand = new DeleteObjectsCommand({
      Bucket: process.env.BUCKET_NAME,
      Delete: {
        Objects: keys.map((key) => ({ Key: key })),
        Quiet: false,
      },
    });

    const result = await s3Client.send(deleteCommand);

    return res.status(200).json({
      message: "Selected images deleted successfully",
      deleted: result.Deleted || [],
      errors: result.Errors || [],
    });
  } catch (err) {
    console.error("Error deleting images:", err);
    return res.status(500).json({ error: "Failed to delete images" });
  }
};



export const listThumbs = async (req, res) => {
  const { eventId, subEventId } = req.body;

  const prefix = `eventimages/${eventId}/${subEventId}/Thumbs/`;

  try {
    const result = await s3Client.send(
      new ListObjectsV2Command({
        Bucket: process.env.BUCKET_NAME,
        Prefix: prefix,
      })
    );

    const keys = result.Contents.map((item) => item.Key);
    console.log("Keys in Thumbs folder:", keys);
    res.json(keys);
  } catch (err) {
    console.error("Failed to list keys:", err);
    res.status(500).json({ error: "Failed to list" });
  }
};


