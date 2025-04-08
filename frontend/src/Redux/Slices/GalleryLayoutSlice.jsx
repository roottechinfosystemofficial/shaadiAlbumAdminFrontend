import { createSlice } from "@reduxjs/toolkit";

export const galleryLayoutSlice = createSlice({
  name: "galleryLayout",
  initialState: {
    layout: "", 
    spacing: "", 
    thumbnail: "", 
    background: "", 
  },
  reducers: {
    setLayout: (state, action) => {
      state.layout = action.payload;
    },
    setSpacing: (state, action) => {
      state.spacing = action.payload;
    },
    setThumbnail: (state, action) => {
      state.thumbnail = action.payload;
    },
    setBackground: (state, action) => {
      state.background = action.payload;
    },
    resetSettings: (state) => {
      state.layout = "";
      state.spacing = "";
      state.thumbnail = "";
      state.background = "";
    },
  },
});

export const {
  setLayout,
  setSpacing,
  setThumbnail,
  setBackground,
  resetSettings,
} = galleryLayoutSlice.actions;
export default galleryLayoutSlice.reducer;
