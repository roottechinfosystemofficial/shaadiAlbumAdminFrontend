import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    authUser: null,
    accessToken: "",
    refreshToken: "",
  },
  reducers: {
    setAuthUser: (state, action) => {
      state.authUser = action.payload;
    },
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
    setRefreshToken: (state, action) => {
      state.refreshToken = action.payload;
    },
  },
});
export const { setAuthUser, setAccessToken, setRefreshToken } =
  userSlice.actions;
export default userSlice.reducer;
