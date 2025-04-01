import express from "express";
import {
  changePassword,
  editPofile,
  getCurrentUser,
  login,
  logoutUser,
  refreshAccessToken,
  selectForgotPasswordOTPProvider,
  signup,
} from "../controller/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const userRouter = express.Router();

userRouter.post("/login", login);
userRouter.post("/user/signup", signup);

userRouter.post("/otp-provider", selectForgotPasswordOTPProvider);

userRouter.get("/current-user", verifyJWT, getCurrentUser);

userRouter.post("/change-password", verifyJWT, changePassword);

userRouter.post("/refreshAccessToken", verifyJWT, refreshAccessToken);

userRouter.put("/user/edit-profile", verifyJWT, editPofile);

userRouter.post("/logout", verifyJWT, logoutUser);

export default userRouter;
