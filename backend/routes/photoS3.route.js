import express from "express";
import {
  getAppEventImages,
  getEventImageCount,
  getEventImages,
  getFlipbookImages,
  getPresignedUrl,
  getFlipbookImagesByEventId,
  getCoverImage,
  deleteSelectedEventImageSingle,
  deleteMultipleEventImages
} from "../controller/photosS3.controller.js";
import { getFaceRecognitionHistoryOfUser, recognizeFaces } from "../controller/awsrecognition.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const photoS3Router = express.Router();

photoS3Router.post("/s3/get-presigned-url", getPresignedUrl);
photoS3Router.post("/s3/list-images", getEventImages);
photoS3Router.post("/s3/list-flipBookimages", getFlipbookImages);
photoS3Router.get("/s3/list-flipBookimagesByEventId/:eventID", getFlipbookImagesByEventId);
// photoS3Router.get("/s3/list-images/:eventId", getEventImages);

photoS3Router.get("/s3/getEventImageCount", getEventImageCount);

// photoS3Router.post("/s3/search-face", searchFaceHandler);
photoS3Router.get("/list-app-images", getAppEventImages);
photoS3Router.get("/s3/cover-image",getCoverImage)
photoS3Router.get("/s3/face-recognition-history/:userId",getFaceRecognitionHistoryOfUser)
photoS3Router.post("/s3/face-recognition/match", express.json({ limit: "5mb" }), recognizeFaces);
photoS3Router.delete("/s3/delete-single/image",deleteSelectedEventImageSingle)
photoS3Router.delete("/s3/delete-multiple/image",deleteMultipleEventImages)




export default photoS3Router;
