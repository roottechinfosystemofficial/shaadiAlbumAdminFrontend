import express from "express";
import {
  changePassword,
  checkAuth,
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

userRouter.post("/user/login", login);
userRouter.post("/user/signup", signup);

userRouter.post("/otp-provider", selectForgotPasswordOTPProvider);

userRouter.get("/current-user", verifyJWT, getCurrentUser);

userRouter.post("/change-password", verifyJWT, changePassword);

userRouter.post("/refreshAccessToken", verifyJWT, refreshAccessToken);

userRouter.put("/user/edit-profile", verifyJWT, editPofile);

userRouter.post("/user/logout", verifyJWT, logoutUser);
userRouter.get("/user/checkAuth", verifyJWT, checkAuth);

export default userRouter;
