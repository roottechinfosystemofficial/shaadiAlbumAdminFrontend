// subscriptionThunk.js

import { createAsyncThunk } from "@reduxjs/toolkit";
import apiRequest from "../../utils/apiRequest";
import { SUBSCRIPTION_API_END_POITS } from "../../constant";
import { load } from "@cashfreepayments/cashfree-js";
import { setSubScriptionState } from "../Slices/planSubscriptionSlice";

// Step 1: Initiate payment & open Cashfree checkout
export const initiatePayment = createAsyncThunk(
  "subscription/initiatePayment",
  async ({ userId, amount, planName }, { rejectWithValue }) => {
    try {
      const response = await apiRequest("POST", `${SUBSCRIPTION_API_END_POITS}/initiate`, {
        userId,
        amount,
        planName,
      });

      const { paymentSessionId, orderId } = response.data;


      // Trigger checkout manually
      // cashfree.checkout({
      //   paymentSessionId,
      //   redirect: false,
      //   onSuccess: async () => {
      //     console.log("Payment Success");
      //     // Step 2 will be triggered in component manually using createSubscription thunk
      //   },
      //   onFailure: (data) => {
      //     console.log("Payment Failed", data);
      //   },
      //   onError: (err) => {
      //     console.error("Error:", err);
      //   },
      // });

      return { orderId,paymentSessionId };
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || err.message);
    }
  }
);
// subscriptionThunk.js

export const createSubscription = createAsyncThunk(
  "subscription/createSubscription",
  async (
    {
      userId,
      orderId,
      planName,
      price,
      storageLimitGB,
      faceRecognitionLimit,
      qrDesignLimit,
      eAlbumLimit,
      crmAccess,
      watermarkAccess,
      albumPhotoSelection,
      imageDownloadControl,
      durationInMonths,
    },
    { rejectWithValue }
  ) => {
    try {
      if(price !=0){
      let status = "PENDING";
      let attempts = 0;
      const maxAttempts = 10;

      // Polling logic
      while (status !== "PAID" && attempts < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, 3000));
        const verifyRes = await apiRequest("GET", `${SUBSCRIPTION_API_END_POITS}/verify/${orderId}`);
        status = verifyRes.data.status;
        attempts++;
        console.log("Polling status:", status);
      }

      if (status !== "PAID") {
        throw new Error("Payment not completed or timed out");
      }
    }

      const payload = {
        userId,
        planName,
        price,
        storageLimitGB,
        faceRecognitionLimit,
        qrDesignLimit,
        eAlbumLimit,
        crmAccess,
        watermarkAccess,
        albumPhotoSelection,
        imageDownloadControl,
        durationInMonths,
      };

      const subRes = await apiRequest("POST", `${SUBSCRIPTION_API_END_POITS}/create-plan`, payload);
      return subRes.data;
    } catch (err) {
      console.error("createSubscription error:", err);
      return rejectWithValue(err?.response?.data?.message || err.message);
    }
  }
);



export const getPlanSubscriptionInfo = createAsyncThunk(
  "subscription/getPlanSubscriptionInfo",
  async ({ id }, thunkApi) => {
    try {
      const res = await apiRequest(
        "GET",
        `${SUBSCRIPTION_API_END_POITS}/get-plan/${id}`
      );

      const data = res.data.subscriptions;

      console.log("thunkResponse",data,res.data.planExpired)

      const subscriptionState=thunkApi.getState().subscription.subscriptionState;

      await thunkApi.dispatch(setSubScriptionState({
        ...subscriptionState,
        subscriptions:data,
        planExpired:res.data.planExpired,
        isActive : res.data.isActive

      }))

      return thunkApi.fulfillWithValue({
        planName: data.planName,
        price: data.price,
        storageLimitGB: data.storageLimitGB,
        usedStorageInBytes: data.usedStorageInBytes,
        faceRecognitionLimit: data.faceRecognitionLimit,
        faceRecognitionsUsed: data.faceRecognitionsUsed,
        qrDesignLimit: data.qrDesignLimit,
        eAlbumLimit: data.eAlbumLimit,
        crmAccess: data.crmAccess,
        watermarkAccess: data.watermarkAccess,
        albumPhotoSelection: data.albumPhotoSelection,
        imageDownloadControl: data.imageDownloadControl,
        startDate: data.startDate,
        endDate: data.endDate,
        isActive: data.isActive,
        subscriptions:data,
        planExpired:res.data.planExpired,
        isActive : res.data.isActive

      });
    } catch (error) {
      return thunkApi.rejectWithValue(
        error?.response?.data?.message || "Failed to fetch subscription info"
      );
    }
  }
);

