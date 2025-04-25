import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createEvent,
  createSubEvent,
  editEventById,
  getAllEventsOfUser,
  getEventById,
} from "../controller/event.controller.js";

const eventRouter = express.Router();
eventRouter.post("/event/createEvent", verifyJWT, createEvent);
eventRouter.get("/event/getAllEventsOfUser", verifyJWT, getAllEventsOfUser);
eventRouter.get("/event/getEventById/:eventId", verifyJWT, getEventById);
eventRouter.put("/event/editEventById/:eventId", verifyJWT, editEventById);
eventRouter.post("/event/createSubEvent/:eventId", verifyJWT, createSubEvent);

export default eventRouter;
