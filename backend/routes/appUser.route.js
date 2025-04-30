import express from "express";
import {
  finalSubmitImages,
  findEventByEventcode,
  findEventByEventPin,
  getSubEventImages,
  login,
  signUp,
  user,
} from "../controller/appUser.controller.js";
import { verifyAppJWT } from "../middlewares/appAuth.middleware.js";
const appUserRouter = express.Router();

appUserRouter.post("/app-user/signup", signUp);
appUserRouter.post("/app-user/login", login);
appUserRouter.get("/app-user/user", verifyAppJWT, user);
appUserRouter.post(
  "/app-event/findEventByEventcode",
  verifyAppJWT,
  findEventByEventcode
);
appUserRouter.post(
  "/app-event/findEventByEventPin",
  verifyAppJWT,
  findEventByEventPin
);
appUserRouter.post("/app-event/final-submit", finalSubmitImages);
appUserRouter.post("/app-event/client-selected", getSubEventImages);
export default appUserRouter;
