import express from "express";
import {
  getEventImages,
  getPresignedUrl,
} from "../controller/photosS3.controller.js";

const photoS3Router = express.Router();

photoS3Router.get("/api/s3/get-presigned-url", getPresignedUrl);
photoS3Router.get("/list-images", getEventImages);

export default photoS3Router;
