import express from "express";
import { getPresignedUrl } from "../controller/photosUpload.controller.js";

const photoUploadRouter = express.Router();

photoUploadRouter.get("/api/s3/get-presigned-url", getPresignedUrl);

export default photoUploadRouter;
