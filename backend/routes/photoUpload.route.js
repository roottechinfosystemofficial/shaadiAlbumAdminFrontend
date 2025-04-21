import express from "express";
import {
  getEventImages,
  getPresignedUrl,
} from "../controller/photosUpload.controller.js";

const photoUploadRouter = express.Router();

photoUploadRouter.get("/api/s3/get-presigned-url", getPresignedUrl);
photoUploadRouter.get("/list-images", getEventImages);

export default photoUploadRouter;
