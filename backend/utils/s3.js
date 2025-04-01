import {
  CompleteMultipartUploadCommand,
  CreateMultipartUploadCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
  UploadPartCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ConfiguredRetryStrategy } from '@smithy/util-retry';

export const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  //endpoint: "https://s3-accelerate.amazonaws.com", // Enable Transfer Acceleration
  requestHandler: {
    timeout: 1200000,
  },
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  //useAccelerateEndpoint: true,
  maxAttempts: 4,
  retryStrategy: new ConfiguredRetryStrategy(
    4,
    (attempt) => 100 + attempt * 1000
  ),
});

const getObjectUrl = async (key) => {
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: key,
  });
  const url = await getSignedUrl(s3Client, command);
  return url;
};

const putObjectUrl = async (key, contentType) => {
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  });

  const url = await getSignedUrl(s3Client, command, { expiresIn: 604800 });
  return url;
};

const initiateMultipartUpload = async (fileName, contentType) => {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: fileName,
    ContentType: contentType,
  };

  const command = new CreateMultipartUploadCommand(params);
  const { UploadId } = await s3Client.send(command);
  return UploadId;
};

const generateMultipartUploadPresignedUrl = async (
  uploadId,
  fileName,
  partNumber,
  chunkSize
) => {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: fileName,
    PartNumber: partNumber,
    UploadId: uploadId,
    Expires: 3600,
  };

  const command = new UploadPartCommand(params);
  const presignedUrl = await getSignedUrl(s3Cslient, command, {
    expiresIn: 3600,
  });
  return presignedUrl;
};

const completeMultipartUpload = async (fileName, uploadId, parts) => {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: fileName,
    UploadId: uploadId,
    MultipartUpload: {
      Parts: parts,
    },
  };

  const command = new CompleteMultipartUploadCommand(params);
  const response = await s3Client.send(command);
  return response;
};
export {
  getObjectUrl,
  putObjectUrl,
  generateMultipartUploadPresignedUrl,
  initiateMultipartUpload,
  completeMultipartUpload,
};
