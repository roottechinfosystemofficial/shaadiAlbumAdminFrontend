import express from "express";
import {
  changePassword,
  checkAuth,
  getDashboardDetails,
  editProfile,
  getCurrentUser,
  login,
  logoutUser,
  refreshAccessToken,
  selectForgotPasswordOTPProvider,
  signup,
  getAllWebAppusers,
} from "../controller/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const userRouter = express.Router();

userRouter.post("/user/login", login);
userRouter.post("/user/signup", signup);

userRouter.post("/otp-provider", selectForgotPasswordOTPProvider);

userRouter.get("/current-user", verifyJWT, getCurrentUser);

userRouter.put("/user/change-password", verifyJWT, changePassword);

userRouter.post("/refreshAccessToken", verifyJWT, refreshAccessToken);

userRouter.put("/user/edit-profile", verifyJWT, editProfile);

userRouter.post("/user/logout", logoutUser);
userRouter.get("/user/checkAuth", verifyJWT, checkAuth);

// Get DashBoard Data API
userRouter.get("/user/dashboard", verifyJWT, getDashboardDetails);

userRouter.get("/user/getalluser",getAllWebAppusers)


export default userRouter;
