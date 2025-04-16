import { configureStore } from "@reduxjs/toolkit";
import coverImgReducer from "./Slices/CoverImgSlice";
import galleryLayoutReducers from "./Slices/GalleryLayoutSlice";
import userReducers from "./Slices/UserSlice";

export const store = configureStore({
  reducer: {
    coverImg: coverImgReducer,
    galleryLayout: galleryLayoutReducers,
    user: userReducers,
  },
});
