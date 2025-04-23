import express from "express";
import {
  getAppEventImages,
  getEventImages,
  getPresignedUrl,
} from "../controller/photosS3.controller.js";

const photoS3Router = express.Router();

photoS3Router.post("/api/s3/get-presigned-url", getPresignedUrl);
photoS3Router.get("/list-images", getEventImages);
photoS3Router.get("/list-app-images", getAppEventImages);

export default photoS3Router;
