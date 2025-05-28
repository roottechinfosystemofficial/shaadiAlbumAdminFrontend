import { createSlice } from "@reduxjs/toolkit";

export const tabSlice = createSlice({
  name: "tab",
  initialState: {
    personalFolderContentTab: "PhotosPanel",
  },
  reducers: {
    setPersonalFolderContentTab: (state, action) => {
      state.personalFolderContentTab = action.payload;
    },
  },
});

export const { setPersonalFolderContentTab } = tabSlice.actions;
export default tabSlice.reducer;
