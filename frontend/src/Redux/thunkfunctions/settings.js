// src/Redux/thunkfunctions/settingThunk.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import apiRequest from "../../utils/apiRequest";
import { SETTINGS_API_END_POINTS } from "../../constant";
import { setSettings } from "../Slices/SettingSlice";
import toast from "../../utils/toast";
export const getSettings = createAsyncThunk(
  "settings/getSettings",
  async ({ userId, accessToken }, { rejectWithValue, dispatch }) => {
    try {
      const response = await apiRequest(
        "GET",
        `${SETTINGS_API_END_POINTS}/get-setting/${userId}`,
        null,
        accessToken,
        dispatch
      );
      return response?.data?.data; // This becomes action.payload
    } catch (error) {
      console.error("Error in getSettings thunk:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const saveUserSettings = createAsyncThunk(
  "settings/saveUserSettings",
  async ({ settingState, userId, accessToken }, { dispatch, rejectWithValue }) => {
    const body = {
      ...settingState,
      userId,
    };


    console.log("req body",body)

    try {
      const res = await apiRequest(
        "POST",
        `${SETTINGS_API_END_POINTS}/save-settings`,
        body,
        accessToken,
        dispatch
      );

      dispatch(setSettings(body));
      toast.success("Settings saved successfully ✅");

      return res.data.data; // optional
    } catch (err) {
      console.error("Save error:", err);
      toast.error("Failed to save settings ❌");
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);
