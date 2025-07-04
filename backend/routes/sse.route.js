import express from "express";
import { registerClient } from "../utils/sse.js";
const SSERouter = express.Router();

SSERouter.get("/sse-events", (req, res) => {
  registerClient(res);
});

export default SSERouter;
