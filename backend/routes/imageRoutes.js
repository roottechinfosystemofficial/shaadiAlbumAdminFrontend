import express from "express";
import { storeImageMetadata } from "../controller/imageController.js";
const imageRouter = express.Router();

imageRouter.post("/store-image-metadata", storeImageMetadata);

export default imageRouter;
