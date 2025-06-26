import {
    RekognitionClient,
    CompareFacesCommand,
    DetectFacesCommand,
} from "@aws-sdk/client-rekognition";

import {
    S3Client,
    GetObjectCommand,
    ListObjectsV2Command,
} from "@aws-sdk/client-s3";

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { config } from "dotenv";
import { Buffer } from "buffer";

config();

// AWS S3 & Rekognition Clients
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

// Helper: Convert S3 ReadableStream to Buffer
const streamToBuffer = async (readableStream) => {
    const chunks = [];
    for await (const chunk of readableStream) {
        chunks.push(chunk);
    }
    return Buffer.concat(chunks);
};

// Get all S3 keys in the bucket (paginated)
export const listAllKeys = async () => {
    const allKeys = [];
    let ContinuationToken;

    do {
        const res = await s3.send(
            new ListObjectsV2Command({
                Bucket: process.env.BUCKET_NAME,
                MaxKeys: 1000,
                ContinuationToken,
            })
        );

        
        const keys = res.Contents?.map((item) => item.Key) || [];
        allKeys.push(...keys);
        ContinuationToken = res.IsTruncated ? res.NextContinuationToken : undefined;
    } while (ContinuationToken);

    console.log("✅ Total S3 keys:", allKeys.length);
    return allKeys;
};

// Compare uploaded image with S3 images
export const findMatchingFaces = async (
    sourceImageBuffer,
    s3Keys = [],
    similarityThreshold = 85
) => {
    const matchedImages = [];

    // Validate uploaded image has a face
    const sourceCheck = await rekognition.send(
        new DetectFacesCommand({
            Image: { Bytes: sourceImageBuffer },
            Attributes: ["DEFAULT"],
        })
    );

    if (!sourceCheck.FaceDetails?.length) {
        console.warn("❌ No face detected in uploaded image.");
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

            const detectTarget = await rekognition.send(
                new DetectFacesCommand({
                    Image: { Bytes: s3ImageBuffer },
                    Attributes: ["DEFAULT"],
                })
            );

            if (!detectTarget.FaceDetails?.length) {
                console.warn(`⚠️ Skipping ${key} — No face detected`);
                continue;
            }

            const compareResult = await rekognition.send(
                new CompareFacesCommand({
                    SourceImage: { Bytes: sourceImageBuffer },
                    TargetImage: { Bytes: s3ImageBuffer },
                    SimilarityThreshold: similarityThreshold,
                })
            );

            const match = compareResult.FaceMatches?.[0];
            if (match) {
                const url = await getSignedUrl(
                    s3,
                    new GetObjectCommand({
                        Bucket: process.env.BUCKET_NAME,
                        Key: key,
                    }),
                    { expiresIn: 3600 }
                );

                matchedImages.push({
                    key,
                    similarity: match.Similarity.toFixed(2),
                    url,
                });
            }
        } catch (err) {
            console.warn(`❌ Error comparing ${key}: ${err.message}`);
        }
    }

    return matchedImages;
};

// Express Controller: Handle face recognition request
export const recognizeFaces = async (req, res) => {
    try {
        const { image,s3Keys } = req.body;

       
        if (!image) {
            return res.status(400).json({ message: "Image is required in base64 format" });
        }

        let base64Image = image.includes(",") ? image.split(",")[1] : image;
        const sourceImageBuffer = Buffer.from(base64Image, "base64");


        const matches = await findMatchingFaces(sourceImageBuffer, s3Keys);

        return res.status(200).json({
            matchFacesCount: matches.length,
            matches,
        });
    } catch (error) {
        console.error("❌ Face recognition error:", error);
        return res.status(500).json({
            message: "Face recognition failed",
            error: error.message,
        });
    }
};