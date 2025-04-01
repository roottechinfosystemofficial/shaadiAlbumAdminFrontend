import express from "express";
import { createCoupons } from "../controller/credits.controller";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const couponRouter = express.Router();

couponRouter.post("/createCoupon", verifyJWT, createCoupons);

export default couponRouter;
