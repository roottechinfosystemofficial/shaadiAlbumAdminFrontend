import express from "express";
import {
  createFlipBook,
  getAllFlipBookByEvent,
  getSingleFlipbookById,
  setFrontBackCoverImg,
  getByEventCode
} from "../controller/flipBook.controller.js";

const flipBookRouter = express.Router();

flipBookRouter.post("/flipbook/createFlipBook/:eventId", createFlipBook);
flipBookRouter.get(
  "/flipbook/getAllFlipBookByEvent/:eventId",
  getAllFlipBookByEvent
);
flipBookRouter.get(
  "/flipbook/getSingleFlipbookById/:flipBookId",
  getSingleFlipbookById
);
flipBookRouter.post("/flipbook/setFrontBackCoverImg", setFrontBackCoverImg);
flipBookRouter.get("/flipbook/getByEventCode", getByEventCode);


export default flipBookRouter;
