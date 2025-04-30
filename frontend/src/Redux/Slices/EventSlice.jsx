import { createSlice } from "@reduxjs/toolkit";

export const eventSlice = createSlice({
  name: "event",
  initialState: {
    singleEvent: null,
    selectedSubEvent: null,
    selectedFlipBook: null,
  },
  reducers: {
    setSingleEvent: (state, action) => {
      state.singleEvent = action.payload;
    },

    updateEventImageCount: (state, action) => {
      if (state.singleEvent) {
        state.singleEvent.eventTotalImages = action.payload;
      }
    },

    setSelectedSubEvent: (state, action) => {
      state.selectedSubEvent = action.payload;
    },

    setSelectedFlipBook: (state, action) => {
      state.selectedFlipBook = action.payload;
    },
  },
});

export const {
  setSingleEvent,
  updateEventImageCount,
  setSelectedSubEvent,
  setSelectedFlipBook,
} = eventSlice.actions;
export default eventSlice.reducer;
