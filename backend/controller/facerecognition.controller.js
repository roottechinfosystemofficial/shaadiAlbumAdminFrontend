import {
    PutObjectCommand,
    GetObjectCommand,
    ListObjectsV2Command,
    S3Client,
} from "@aws-sdk/client-s3";
import {
    RekognitionClient,

    CompareFacesCommand
} from "@aws-sdk/client-rekognition";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import sharp from "sharp";
import dotenv from "dotenv";

dotenv.config();

const s3Client = new S3Client({
    region: process.env.AWS_REGION,
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

//   const ensureCollectionExists = async (collectionId) => {
//     const listCmd = new ListCollectionsCommand({});
//     const collections = await rekognitionClient.send(listCmd);

//     if (!collections.CollectionIds.includes(collectionId)) {
//       await rekognitionClient.send(
//         new CreateCollectionCommand({ CollectionId: collectionId })
//       );
//     }
//   };

//   const parseBase64Image = (base64Image) => {
//     const matches = base64Image.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
//     if (!matches || matches.length !== 3) throw new Error("Invalid base64 image format");
//     return Buffer.from(matches[2], "base64");
//   };

//   const fetchSignedUrls = async (bucket, prefix) => {
//     const listCmd = new ListObjectsV2Command({
//       Bucket: bucket,
//       Prefix: prefix,
//       MaxKeys: 1000,
//     });

//     const { Contents = [] } = await s3Client.send(listCmd);

//     const urls = await Promise.all(
//       Contents.map(async (obj) => {
//         const signedUrl = await getSignedUrl(
//           s3Client,
//           new GetObjectCommand({
//             Bucket: bucket,
//             Key: obj.Key,
//           }),
//           { expiresIn: 3600 }
//         );
//         return {
//           key: obj.Key,
//           filename: obj.Key.split("/").pop().toLowerCase(),
//           url: signedUrl,
//         };
//       })
//     );

//     return urls;
//   };



// export const matchFaceController = async (req, res) => {
//     try {
//         const { image, eventId, subEventId } = req.body;

//         if (!image || !eventId || !subEventId) {
//             return res.status(400).json({ error: 'Invalid request body' });
//         }

//         const s3Images = await getEventImages(eventId, subEventId, '', '');
//         const imageUrls = s3Images?.map(i => i.originalUrl) || [];

//         const imageBuffer = Buffer.from(image, 'base64');
//         const matchedImages = [];

//         for (const s3Path of imageUrls) {
//             const url = new URL(s3Path);
//             const Bucket = url.hostname.split('.')[0]; // e.g., my-bucket
//             const Key = decodeURIComponent(url.pathname.slice(1)); // e.g., eventimages/.../image.jpg

//             const compareParams = {
//                 SourceImage: { Bytes: imageBuffer },
//                 TargetImage: { S3Object: { Bucket, Key } },
//                 SimilarityThreshold: 90,
//             };

//             const result = await rekognitionClient.send(new CompareFacesCommand(compareParams));

//             if (result.FaceMatches && result.FaceMatches.length > 0) {
//                 matchedImages.push(s3Path);
//             }
//         }

//         return res.json({
//             matchedImages,
//             count: matchedImages.length,
//         });
//     } catch (err) {
//         console.error('Face matching error:', err);
//         res.status(500).json({ error: 'Face matching failed', details: err.message });
//     }
// };


export const getEventImages = async (eventId, subEventId, continuationTokenOriginal, continuationTokenThumbs) => {
    if (!eventId || !subEventId) return [];
  
    try {
      const basePrefix = `eventimages/${eventId}/${subEventId}/`;
      const pageSize = 100;
  
      const fetchFolderItems = async (folder, token) => {
        const prefix = `${basePrefix}${folder}/`;
        const listCommand = new ListObjectsV2Command({
          Bucket: process.env.BUCKET_NAME,
          Prefix: prefix,
          MaxKeys: pageSize,
          ContinuationToken: token || undefined,
        });
  
        const response = await s3Client.send(listCommand);
  
        return await Promise.all(
          (response.Contents || []).map(async (item) => {
            const filename = item.Key.split("/").pop()?.toLowerCase();
            const getCommand = new GetObjectCommand({
              Bucket: process.env.BUCKET_NAME,
              Key: item.Key,
            });
            const url = await getSignedUrl(s3Client, getCommand);
            return { filename, key: item.Key, url };
          })
        );
      };
  
      const [originalData, thumbData] = await Promise.all([
        fetchFolderItems("Original", continuationTokenOriginal),
        fetchFolderItems("Thumbs", continuationTokenThumbs),
      ]);
  
      const originalMap = {};
      originalData.forEach((img) => {
        if (img.filename) originalMap[img.filename] = { url: img.url, key: img.key };
      });
  
      const thumbMap = {};
      thumbData.forEach((img) => {
        if (img.filename) thumbMap[img.filename] = img.url;
      });
  
      const allFilenames = new Set([...Object.keys(originalMap), ...Object.keys(thumbMap)]);
  
      return Array.from(allFilenames)
        .filter((f) => originalMap[f] && thumbMap[f])
        .map((f) => ({
          filename: f,
          key: originalMap[f].key,
          originalUrl: originalMap[f].url,
          thumbnailUrl: thumbMap[f],
        }));
    } catch (err) {
      console.error("❌ Error in getEventImages:", err);
      return [];
    }
  };

  export const matchFaceController = async (req, res) => {
    try {
      const { image, eventId, subEventId } = req.body;
  
      if (!image || !eventId || !subEventId) {
        return res.status(400).json({ error: "Missing required fields" });
      }
  
      const base64Data = image.includes(",") ? image.split(",")[1] : image;
      const imageBuffer = Buffer.from(base64Data, "base64");
  
      if (!imageBuffer || imageBuffer.length === 0) {
        return res.status(400).json({ error: "Invalid or empty image" });
      }
  
      const s3Images = await getEventImages(eventId, subEventId, "", "");
      const matchedImages = [];
  
      for (const imageObj of s3Images) {
        try {
          const Bucket = process.env.BUCKET_NAME || "shaadialbumdemo";
          const Key = `face-scans/${imageObj.filename}`;
          console.log("key of s3",Key)
  
          if (!Key) {
            console.warn("⚠️ Skipping missing key for image:", imageObj.filename);
            continue;
          }
  
          const compareParams = {
            SourceImage: { Bytes: imageBuffer },
            TargetImage: { S3Object: { Bucket, Key } },
            SimilarityThreshold: 90,
          };
  
          const result = await rekognitionClient.send(new CompareFacesCommand(compareParams));
  
          if (result.FaceMatches?.length > 0) {
            matchedImages.push({
              filename: imageObj.filename,
              s3Key: Key,
              matchUrl: imageObj.originalUrl,
              similarity: result.FaceMatches[0].Similarity.toFixed(2),
            });
          }
        } catch (err) {
          console.warn(`⚠️ Comparison failed for ${imageObj.filename}:`, err.message);
          continue;
        }
      }
  
      return res.json({
        matchedImages,
        count: matchedImages.length,
      });
    } catch (err) {
      console.error("❌ Face match failed:", err);
      return res.status(500).json({ error: "Face match error", details: err.message });
    }
  };
  