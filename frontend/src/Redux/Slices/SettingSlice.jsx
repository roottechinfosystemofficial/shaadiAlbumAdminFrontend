// src/Redux/Slices/SettingSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { getSettings } from "../thunkfunctions/settings";
const initialState = {
  settingState: {
    watermarkType: "text",
    watermarkText: "Dhruv",
    fontStyle: "Arial",
    fontColor: "white",
    fontSize: 75,
    opacity: 50,
    position: "bottom-right",
    iconImg: "",
    waterMarkEnabled: false,
    iconSize:0
  },
  loading: false,
  error: null,
};

const settings = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setSettings(state, action) {
      state.settingState = action.payload;
    },
    resetSettings(state) {
      state.settingState = initialState.settingState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.settingState = action.payload;
      })
      .addCase(getSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch settings.";
      });
  },
});

export const { setSettings, resetSettings } = settings.actions;
export default settings.reducer;
