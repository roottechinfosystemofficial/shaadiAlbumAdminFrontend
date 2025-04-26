import express from "express";
import {
  getAppEventImages,
  getEventImageCount,
  getEventImages,
  getPresignedUrl,
} from "../controller/photosS3.controller.js";

const photoS3Router = express.Router();

photoS3Router.post("/s3/get-presigned-url", getPresignedUrl);
photoS3Router.get("/s3/list-images", getEventImages);
photoS3Router.get("/list-app-images", getAppEventImages);
photoS3Router.get("/s3/getEventImageCount", getEventImageCount);

export default photoS3Router;
