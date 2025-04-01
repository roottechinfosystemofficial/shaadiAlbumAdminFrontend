import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Coupon from "../models/Coupon.js";
import User from "../models/User.js";

export const createCoupons = async (req, res) => {
  try {
    const { expiry, planType, code } = req.body;
    if (!expiry || !credits || !code) {
      throw new ApiError(400, "All fields are required");
    }

    const coupon = new Coupon({
      expiry,
      planType,
      code,
      adminId: req.userId,
    });

    const savedCoupon = await coupon.save();
    return res
      .status(200)
      .json(new ApiResponse(200, savedCoupon, "coupon created successfully"));
  } catch (error) {
    console.error("🔴 Error in createCoupons :", error);
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal Server Error"));
  }
};

export const updateCoupon = async (req, res) => {
  try {
    const { couponId } = req.params;
    const { code, expiry, credits } = req.body;
    const coupon = await Coupon.findById(couponId);
    if (!coupon) {
      throw new ApiError(404, "Coupon not found");
    }
    if (code) coupon.code = code;
    if (expiry) coupon.expiry = expiry;
    if (credits) coupon.credits = credits;
    const updatedCoupon = await coupon.save();
    return res
      .status(200)
      .json(new ApiResponse(200, updatedCoupon, "Coupon updated successfully"));
  } catch (error) {
    console.error("🔴 Error while Updating Coupon", error);
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal Server Error"));
  }
};

export const deleteCoupon = async (req, res) => {
  try {
    const { couponId } = req.params;
    const coupon = await Coupon.findById(couponId);
    if (!coupon) {
      throw new ApiError(404, "Coupon not found");
    }
    await Coupon.deleteOne({ _id: couponId });
    return res
      .status(200)
      .json(new ApiResponse(200, null, "Coupon deleted successfully"));
  } catch (error) {
    console.error("🔴 Error while Deleting Coupon", error);
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal Server Error"));
  }
};

export const redeemCoupon = async (req, res) => {
  try {
    const { couponCode } = req.body;
    const coupon = await Coupon.findOne({ code: couponCode });
    if (!coupon) {
      throw new ApiError(404, "Coupon not found");
    }
    if (coupon.expiry < new Date()) {
      throw new ApiError(400, "Coupon expired");
    }
    const userId = req.userId;
    const user = await User.findById(userId);
    //TODO: Add credits to user
    console.log("User Credits", user);

    return res
      .status(200)
      .json(new ApiResponse(200, coupon, "Coupon redeemed successfully"));
  } catch (error) {}
};
