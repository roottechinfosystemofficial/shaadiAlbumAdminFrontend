import { configureStore } from "@reduxjs/toolkit";
import coverImgReducer from "./Slices/CoverImgslice";

export const store = configureStore({
  reducer: {
    coverImg: coverImgReducer,
  },
});
