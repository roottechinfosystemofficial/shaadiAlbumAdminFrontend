import { createSlice } from "@reduxjs/toolkit";

export const coverImgSlice = createSlice({
  name: "coverImg",
  initialState: {
    coverImg: null,
    position: "",
  },
  reducers: {
    setCoverImg: (state, action) => {
      state.coverImg = action.payload;
    },
    setPosition: (state, action) => {
      state.position = action.payload;
    },
  },
});

export const { setCoverImg, setPosition } = coverImgSlice.actions;
export default coverImgSlice.reducer;
