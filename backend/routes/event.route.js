import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createEvent,
  createSubEvent,
  editEventById,
  getAllEventsOfUser,
  getEventById,
  updateDownloadSetting,
  updateDownloadSettingPost,
  getFavouriteImage
} from "../controller/event.controller.js";

const eventRouter = express.Router();
eventRouter.post("/event/createEvent", verifyJWT, createEvent);
eventRouter.get("/event/getAllEventsOfUser", verifyJWT, getAllEventsOfUser);
eventRouter.get("/event/getEventById/:eventId", verifyJWT, getEventById);
eventRouter.put("/event/editEventById/:eventId", verifyJWT, editEventById);
eventRouter.post("/event/createSubEvent/:eventId", verifyJWT, createSubEvent);

// export Event Setting Download API;
eventRouter.get("/event/DownloadEventSetting/:eventId",verifyJWT, updateDownloadSetting);
eventRouter.post("/event/DownloadEventSetting/:eventId",verifyJWT, updateDownloadSettingPost);
eventRouter.get("/event/getFavouriteImage",verifyJWT, getFavouriteImage);

export default eventRouter;
