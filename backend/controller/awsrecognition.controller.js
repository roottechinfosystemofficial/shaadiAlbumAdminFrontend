import {
    RekognitionClient,
    CompareFacesCommand,
    DetectFacesCommand

} from "@aws-sdk/client-rekognition";
import {
    S3Client,
    GetObjectCommand,
    ListObjectsV2Command
} from "@aws-sdk/client-s3";
import { config } from "dotenv";
import { Buffer } from "buffer";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { FaceRecognitionHistory } from "../model/faceRecognitionHistory.model.js";
import mongoose from "mongoose";
import { getActiveSubscription,checkFaceRecognitionLimit,incrementFaceRecognitionUsage } from "../utils/planChecks.js";

config();



const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.ACCESSID,
        secretAccessKey: process.env.SECRETACCESSKEY,
    },
});

const rekognition = new RekognitionClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.ACCESSID,
        secretAccessKey: process.env.SECRETACCESSKEY,
    },
});

const streamToBuffer = async (readableStream) => {
    const chunks = [];
    for await (const chunk of readableStream) {
        chunks.push(chunk);
    }
    return Buffer.concat(chunks);
};

// export const findMatchingFaces = async (cameraFaceBuffer, s3Keys = [], similarityThreshold = 90) => {
//     const matchedImages = [];

//     for (const key of s3Keys) {
//         try {
//             const { Body } = await s3.send(
//                 new GetObjectCommand({
//                     Bucket: process.env.BUCKET_NAME,
//                     Key: key,
//                 })
//             );
//             const s3ImageBuffer = await streamToBuffer(Body);

//             const compareResult = await rekognition.send(
//                 new CompareFacesCommand({
//                     SourceImage: { Bytes: cameraFaceBuffer },
//                     TargetImage: { Bytes: s3ImageBuffer },
//                     SimilarityThreshold: similarityThreshold,
//                 })
//             );

//             const match = compareResult.FaceMatches?.[0];
//             if (match && match.Similarity >= similarityThreshold) {
//                 matchedImages.push({ key, similarity: match.Similarity.toFixed(2) });
//             }
//         } catch (err) {
//             console.warn(`Error comparing ${key}: ${err.message}`);
//         }
//     }

//     return matchedImages;
// };

// export const findMatchingFaces = async (cameraFaceBuffer, s3Keys = [], similarityThreshold = 85) => {
//   const matchedImages = [];

//   for (const key of s3Keys) {
//     try {
//       // Get target image buffer from S3
//       const getObj = await s3.send(
//         new GetObjectCommand({
//           Bucket: process.env.BUCKET_NAME,
//           Key: key,
//         })
//       );

//       const s3ImageBuffer = await streamToBuffer(getObj.Body);

//       // Run comparison
//       const compareResult = await rekognition.send(
//         new CompareFacesCommand({
//           SourceImage: { Bytes: cameraFaceBuffer },
//           TargetImage: { Bytes: s3ImageBuffer },
//           SimilarityThreshold: similarityThreshold,
//         })
//       );

//       const match = compareResult.FaceMatches?.[0];
//       if (match) {
//         // Generate pre-signed URL for match
//         const url = await getSignedUrl(
//           s3,
//           new GetObjectCommand({
//             Bucket: process.env.BUCKET_NAME,
//             Key: key,
//           }),
//           { expiresIn: 3600 } // 1 hour
//         );

//         matchedImages.push({
//           key,
//           similarity: match.Similarity.toFixed(2),
//           url
//         });
//       }
//     } catch (err) {
//       console.warn(`❌ Error comparing ${key}: ${err.message}`);
//     }
//   }

//   return matchedImages;
// };


export const findMatchingFaces = async (cameraFaceBuffer, s3Keys = [], similarityThreshold = 25) => {
    const matchedImages = [];

    // Validate source image (camera)
    const sourceFaceCheck = await rekognition.send(
        new DetectFacesCommand({
            Image: { Bytes: cameraFaceBuffer },
            Attributes: ["DEFAULT"],
        })
    );

    if (sourceFaceCheck.FaceDetails.length === 0) {
        console.warn("❌ No face detected in source image (camera)");
        return [];
    }

    for (const key of s3Keys) {
        try {
            const { Body } = await s3.send(
                new GetObjectCommand({
                    Bucket: process.env.BUCKET_NAME,
                    Key: key,
                })
            );

            const s3ImageBuffer = await streamToBuffer(Body);

            // ✅ Check if target image has a face
            const detectTarget = await rekognition.send(
                new DetectFacesCommand({
                    Image: { Bytes: s3ImageBuffer },
                    Attributes: ["DEFAULT"],
                })
            );

            if (detectTarget.FaceDetails.length === 0) {
                console.warn(`⚠️ Skipping ${key} — No face detected`);
                continue;
            }

            // ✅ Run comparison only if both images have faces
            const compareResult = await rekognition.send(
                new CompareFacesCommand({
                    SourceImage: { Bytes: cameraFaceBuffer },
                    TargetImage: { Bytes: s3ImageBuffer },
                    SimilarityThreshold: similarityThreshold,
                })
            );

            const match = compareResult.FaceMatches?.[0];
            if (match) {
                       const publicUrl = `https://${process.env.BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;


                matchedImages.push({
                    key,
                    similarity: match.Similarity.toFixed(2),
                    url:publicUrl,
                });
            }
        } catch (err) {
            console.warn(`❌ Error comparing ${key}: ${err.message}`);
        }
    }

    return matchedImages;
};


export const recognizeFaces = async (req, res) => {
  try {
    const { image, s3Keys, userId, eventId, subEventId, eventName } = req.body;

    if (!image || !s3Keys || !Array.isArray(s3Keys)) {
      return res.status(400).json({ message: "Invalid input" });
    }

    const subscription = await getActiveSubscription(userId);
    if (!subscription) {
      return res.status(403).json({ message: "No active subscription." });
    }

    if (!checkFaceRecognitionLimit(subscription)) {
      return res.status(403).json({ message: "Face recognition limit exceeded." });
    }

    let base64Image = image;
    if (base64Image.includes(',')) {
      base64Image = base64Image.split(',')[1];
    }

    const cameraFaceBuffer = Buffer.from(base64Image, "base64");
    const matches = await findMatchingFaces(cameraFaceBuffer, s3Keys);

    const existingfaceRecognition = await FaceRecognitionHistory.findOne({ event: eventId });

    if (existingfaceRecognition?.matchesCount != 0 && existingfaceRecognition) {
      existingfaceRecognition.subEventId = subEventId;
      existingfaceRecognition.matches = matches;
      existingfaceRecognition.matchesCount = matches?.length;
      existingfaceRecognition.image = image;
      existingfaceRecognition.eventName = eventName;
      existingfaceRecognition.updatedAt = new Date();

      await existingfaceRecognition?.save();
    } else {
      const newFaceRecognitionHistory = new FaceRecognitionHistory({
        event: eventId,
        subEventId: subEventId,
        matches: matches,
        matchesCount: matches?.length,
        user: userId,
        image: image,
        eventName: eventName,
      });
      await newFaceRecognitionHistory.save();
    }

    // ✅ Update face recognition usage count
    await incrementFaceRecognitionUsage(subscription);

    res.status(200).json({ matches, matchFacesCount: matches?.length });
  } catch (error) {
    console.error("Recognition error:", error);
    res.status(500).json({ message: "Recognition failed" });
  }
};

// export const recognizeFaces = async (req, res) => {
//     try {
//         const { image, s3Keys, userId, eventId, subEventId, eventName } = req.body;

//         if (!image || !s3Keys || !Array.isArray(s3Keys)) {
//             return res.status(400).json({ message: "Invalid input" });
//         }
//         let base64Image = image;
//         if (base64Image.includes(',')) {
//             base64Image = base64Image.split(',')[1]; // Strip data URL prefix
//         }

//         const cameraFaceBuffer = Buffer.from(base64Image, "base64");


//         const matches = await findMatchingFaces(cameraFaceBuffer, s3Keys);


//         const existingfaceRecognition = await FaceRecognitionHistory.findOne({ event: eventId });

//         if (existingfaceRecognition?.matchesCount != 0 && existingfaceRecognition) {
//             existingfaceRecognition.subEventId = subEventId;
//             existingfaceRecognition.matches = matches;
//             existingfaceRecognition.matchesCount = matches?.length;
//             existingfaceRecognition.image = image;
//             existingfaceRecognition.eventName = eventName;
//             existingfaceRecognition.updatedAt = new Date();

//             await existingfaceRecognition?.save();
//             res.status(200).json({ matches, matchFacesCount: matches?.length });
//             return;


//         }
//         else {

//             const newFaceRecognitionHistory = new FaceRecognitionHistory({
//                 event: eventId,
//                 subEventId: subEventId,
//                 matches: matches,
//                 matchesCount: matches?.length,
//                 user: userId,
//                 image: image,
//                 eventName: eventName


//             })
//             await newFaceRecognitionHistory.save()
//         }

//         res.status(200).json({ matches, matchFacesCount: matches?.length });
//     } catch (error) {
//         console.error("Recognition error:", error);
//         res.status(500).json({ message: "Recognition failed" });
//     }
// };



export const listAllKeys = async () => {

    const res = await s3.send(
        new ListObjectsV2Command({
            Bucket: process.env.BUCKET_NAME,
        })
    );

    console.log("✅ Existing Keys in Bucket:");
    const keys = res.Contents?.map((item) => item.Key) || [];


    return keys

};

export const getFaceRecognitionHistoryOfUser = async (req, res) => {
    const { userId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    try {
        const result = await FaceRecognitionHistory.aggregate([
            { $match: { user: new mongoose.Types.ObjectId(userId) } },
            { $sort: { createdAt: -1 } },
            {
                $group: {
                    _id: "$event",
                    doc: { $first: "$$ROOT" }
                }
            },
            { $replaceRoot: { newRoot: "$doc" } },
            {
                $facet: {
                    data: [{ $skip: skip }, { $limit: limit }],
                    totalCount: [{ $count: "count" }]
                }
            }
        ]);


        const history = result[0]?.data || [];
        const total = result[0]?.totalCount[0]?.count || 0;
        const totalPages = Math.ceil(total / limit);

        return res.status(200).json({
            history,
            page,
            limit,
            total,
            totalPages
        });
    } catch (err) {
        console.error("❌ Error fetching face recognition history:", err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

