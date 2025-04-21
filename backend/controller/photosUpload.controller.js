import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// S3 client config (without dotenv — okay for testing/dev)
const s3Client = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: "AKIAXYXCP35HZWCGK4VM",
    secretAccessKey: "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",
  },
});

export const getPresignedUrl = async (req, res) => {
  const { fileName, fileType } = req.query;

  if (!fileName || !fileType) {
    return res.status(400).json({ error: "Missing fileName or fileType" });
  }

  const command = new PutObjectCommand({
    Bucket: "shaadialbumdemo",
    Key: `upload/${Date.now()}-${fileName}`,
    ContentType: fileType,
  });

  try {
    const signedUrl = await getSignedUrl(s3Client, command);
    res.status(200).json({ url: signedUrl });
  } catch (err) {
    console.error("Error generating signed URL:", err);
    res.status(500).json({ error: "Could not generate signed URL" });
  }
};
