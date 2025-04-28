import express from "express";
import { createFlipBook } from "../controller/flipbook.controller.js";

const flipBookRouter = express.Router();

flipBookRouter.post("/flipbook/createFlipBook", createFlipBook);

export default flipBookRouter;
