import express from "express";
import {
  createFlipBook,
  getAllFlipBookByEvent,
  getSingleFlipbookById,
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

export default flipBookRouter;
