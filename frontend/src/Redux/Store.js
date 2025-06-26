// Redux store setup
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer, createTransform } from "redux-persist";
import storage from "redux-persist/lib/storage";

import coverImgReducer from "./Slices/CoverImgSlice";
import galleryLayoutReducer from "./Slices/GalleryLayoutSlice";
import userReducer from "./Slices/UserSlice";
import eventReducer from "./Slices/EventSlice.jsx";
import tabReducer from "./Slices/TabSlice.jsx";
import  s3ImageReducer from "./Slices/S3Images.jsx";
import settingsReducer from './Slices/SettingSlice.jsx'

// 🔐 Persist only `authUser` from user slice
const authUserTransform = createTransform(
  (inboundState) => ({ authUser: inboundState.authUser }),
  (outboundState) => outboundState,
  { whitelist: ["user"] }
);

// 🗂 Persist only `currentEvent` from event slice
// const singleEventTransform = createTransform(
//   // transform state on its way to being serialized and persisted
//   (inboundState) => ({
//     currentEventId: inboundState.currentEventId,
//     currentSubEventId: inboundState.currentSubEventId,
//     currentFlipbookId: inboundState.currentFlipbookId,
//   }),

//   // transform state being rehydrated
//   (outboundState) => outboundState,

//   { whitelist: ["event"] }
// );

const singleEventTransform = createTransform(
  (inboundState) => ({
    currentEvent: inboundState.currentEvent,
    currentSubEvent: inboundState.currentSubEvent,
    currentFlipbookId: inboundState.currentFlipbookId,
  }),
  (outboundState) => outboundState,
  { whitelist: ["event"] }
);

// 🛠 Persist config with transforms
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user", "event"], // Include user and event
  transforms: [authUserTransform, singleEventTransform],
};

// 🧠 Combine reducers
const rootReducer = combineReducers({
  user: userReducer,
  galleryLayout: galleryLayoutReducer,
  coverImg: coverImgReducer,
  event: eventReducer,
  tab: tabReducer,
  s3Images:s3ImageReducer,
  settings:settingsReducer
});

// 🧊 Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// 🏪 Configure store
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// 🚀 Create persistor
const persistor = persistStore(store);

export { store, persistor };
