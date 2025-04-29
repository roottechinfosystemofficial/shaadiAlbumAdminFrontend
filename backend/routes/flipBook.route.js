import express from "express";
import {
  createFlipBook,
  getAllFlipBookByEvent,
} from "../controller/flipbook.controller.js";

const flipBookRouter = express.Router();

flipBookRouter.post("/flipbook/createFlipBook/:eventId", createFlipBook);
flipBookRouter.get(
  "/flipbook/getAllFlipBookByEvent/:eventId",
  getAllFlipBookByEvent
);

export default flipBookRouter;
