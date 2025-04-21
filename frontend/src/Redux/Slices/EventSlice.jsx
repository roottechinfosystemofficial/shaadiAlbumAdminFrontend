import { createSlice } from "@reduxjs/toolkit";

export const eventSlice = createSlice({
  name: "event",
  initialState: {
    singleEvent: null,
  },
  reducers: {
    setSingleEvent: (state, action) => {
      state.singleEvent = action.payload;
    },
  },
});

export const { setSingleEvent } = eventSlice.actions;
export default eventSlice.reducer;
