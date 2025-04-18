import express from "express";
import { signUp } from "../controller/appUser.controller.js";
const appUserRouter = express.Router();

appUserRouter.post("/app-user/signup", signUp);
export default appUserRouter;
