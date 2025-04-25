import { createSlice } from "@reduxjs/toolkit";

export const eventSlice = createSlice({
  name: "event",
  initialState: {
    singleEvent: null,
    selectedSubEvent: null,
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
  },
});

export const { setSingleEvent, updateEventImageCount, setSelectedSubEvent } =
  eventSlice.actions;
export default eventSlice.reducer;
