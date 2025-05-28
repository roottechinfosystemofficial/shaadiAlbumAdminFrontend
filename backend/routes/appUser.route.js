import express from "express";
import {
  changePassword,
  deleteSearchedEvent,
  finalSubmitImages,
  findEventByEventcode,
  findEventByEventPin,
  getSubEventImages,
  login,
  signUp,
  updateUserName,
  user,
} from "../controller/appUser.controller.js";
import { verifyAppJWT } from "../middlewares/appAuth.middleware.js";
const appUserRouter = express.Router();

appUserRouter.post("/app-user/signup", signUp);
appUserRouter.post("/app-user/change-password", verifyAppJWT, changePassword);
appUserRouter.post("/app-user/login", login);
appUserRouter.get("/app-user/user", verifyAppJWT, user);
appUserRouter.put("/app-user/update-profile", verifyAppJWT, updateUserName);
appUserRouter.post(
  "/app-event/findEventByEventcode",
  verifyAppJWT,
  findEventByEventcode
);
appUserRouter.post(
  "/app-event/deleteSearchedEvent",
  verifyAppJWT,
  deleteSearchedEvent
);
appUserRouter.post(
  "/app-event/findEventByEventPin",
  verifyAppJWT,
  findEventByEventPin
);
appUserRouter.post("/app-event/final-submit", finalSubmitImages);
appUserRouter.post("/app-event/client-selected", getSubEventImages);
export default appUserRouter;
