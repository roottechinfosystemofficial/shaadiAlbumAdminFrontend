import { configureStore } from "@reduxjs/toolkit";
import coverImgReducer from "./Slices/CoverImgslice";
import galleryLayoutReducers from "./Slices/GalleryLayoutSlice";

export const store = configureStore({
  reducer: {
    coverImg: coverImgReducer,
    galleryLayout: galleryLayoutReducers,
  },
});
