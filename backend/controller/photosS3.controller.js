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

export const getPresignedUrl = async (req, res) => {
  const { files, eventId } = req.body;

  if (!files || !Array.isArray(files) || !eventId) {
    return res.status(400).json({ error: "Missing files or eventId" });
  }

  const timestamp = Date.now();

  const generateBatchUrls = async (files, eventId) => {
    const batches = [];
    for (let i = 0; i < files.length; i += BATCH_SIZE) {
      const batch = files.slice(i, i + BATCH_SIZE);
      batches.push(batch);
    }

    let signedUrls = [];

    for (const batch of batches) {
      const batchUrls = await Promise.all(
        batch.map(async ({ fileName, fileType, fileSize }, index) => {
          if (fileSize > MAX_FILE_SIZE_MB * 1024 * 1024) {
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

          const url = await getSignedUrl(s3Client, command);

          return { url, key: uniqueKey, fileName };
        })
      );
      signedUrls = [...signedUrls, ...batchUrls];
    }

    return signedUrls;
  };

  try {
    const signedUrls = await generateBatchUrls(files, eventId);
    console.log(signedUrls.length);
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

// helper to convert stream to buffer
const streamToBuffer = async (stream) => {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("end", () => resolve(Buffer.concat(chunks)));
    stream.on("error", reject);
  });
};

export const getAppEventImages = async (req, res) => {
  const { eventId, page = 1 } = req.query;
  const pageSize = 25;

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
        MaxKeys: 1000,
        ContinuationToken: continuationToken,
      });

      const response = await s3Client.send(listCommand);
      allItems = [...allItems, ...(response.Contents || [])];
      continuationToken = response.IsTruncated
        ? response.NextContinuationToken
        : null;
    } while (continuationToken);

    const sortedItems = allItems.sort(
      (a, b) => new Date(b.LastModified) - new Date(a.LastModified)
    );

    const startIndex = (page - 1) * pageSize;
    const paginatedItems = sortedItems.slice(startIndex, startIndex + pageSize);

    const imageUrls = await Promise.all(
      paginatedItems.map(async (item) => {
        const getCommand = new GetObjectCommand({
          Bucket: process.env.BUCKET_NAME,
          Key: item.Key,
        });

        const image = await s3Client.send(getCommand);
        const buffer = await streamToBuffer(image.Body);

        const resizedImage = await sharp(buffer)
          .resize(800)
          .jpeg({ quality: 50 })
          .toBuffer();

        // Optional: Upload resized image to S3 if needed

        const resizedImageUrl = await getSignedUrl(s3Client, getCommand, {
          expiresIn: 3600,
        });

        return resizedImageUrl;
      })
    );

    res.status(200).json({
      images: imageUrls,
      hasNextPage: paginatedItems.length === pageSize,
    });
  } catch (err) {
    console.error("Error fetching images:", err);
    res.status(500).json({ error: "Could not retrieve images" });
  }
};
