// import { createSlice } from "@reduxjs/toolkit";

// export const eventSlice = createSlice({
//   name: "event",
//   initialState: {
//     currentEvent: null,
//     currentSubEvent: null,
//     currentFlipbook: null,
//     currentFlipbookId: "",
//     currentSubEventId: "",
//     currentEventId: "",
//   },
//   reducers: {
//     setCurrentEvent: (state, action) => {
//       state.currentEvent = action.payload;
//     },

//     updateEventImageCount: (state, action) => {
//       if (state.currentEvent) {
//         state.currentEvent.eventTotalImages = action.payload;
//       }
//     },

//     setCurrentSubEvent: (state, action) => {
//       state.currentSubEvent = action.payload;
//     },

//     setCurrentFlipbook: (state, action) => {
//       state.currentFlipbook = action.payload;
//     },

//     setCurrentFlipbookId: (state, action) => {
//       state.currentFlipbookId = action.payload;
//     },
//   },
// });

// export const {
//   setCurrentEvent,
//   updateEventImageCount,
//   setCurrentSubEvent,
//   setCurrentFlipbook,
//   setFlipBookId,
// } = eventSlice.actions;
// export default eventSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

export const eventSlice = createSlice({
  name: "event",
  initialState: {
    currentEvent: null,
    currentSubEvent: null,
    currentFlipbook: null,
    currentEventId: "",
    currentSubEventId: "",
    currentFlipbookId: "",
  },
  reducers: {
    setCurrentEvent: (state, action) => {
      state.currentEvent = action.payload;
    },

    updateEventImageCount: (state, action) => {
      if (state.currentEvent) {
        state.currentEvent.eventTotalImages = action.payload;
      }
    },

    setCurrentSubEvent: (state, action) => {
      state.currentSubEvent = action.payload;
    },

    setCurrentFlipbook: (state, action) => {
      state.currentFlipbook = action.payload;
    },

    setCurrentEventId: (state, action) => {
      state.currentEventId = action.payload;
    },

    setCurrentSubEventId: (state, action) => {
      state.currentSubEventId = action.payload;
    },

    setCurrentFlipbookId: (state, action) => {
      state.currentFlipbookId = action.payload;
    },
  },
});

export const {
  setCurrentEvent,
  updateEventImageCount,
  setCurrentSubEvent,
  setCurrentFlipbook,
  setCurrentEventId,
  setCurrentSubEventId,
  setCurrentFlipbookId,
} = eventSlice.actions;

export default eventSlice.reducer;
