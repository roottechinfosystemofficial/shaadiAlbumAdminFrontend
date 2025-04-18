import express from "express";
import { login, signUp, user } from "../controller/appUser.controller.js";
import { verifyAppJWT } from "../middlewares/appAuth.middleware.js";
const appUserRouter = express.Router();

appUserRouter.post("/app-user/signup", signUp);
appUserRouter.post("/app-user/login", login);
appUserRouter.get("/app-user/user", verifyAppJWT, user);
export default appUserRouter;
