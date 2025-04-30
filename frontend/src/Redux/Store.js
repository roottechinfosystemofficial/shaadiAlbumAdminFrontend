// Redux store setup
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer, createTransform } from "redux-persist";
import storage from "redux-persist/lib/storage"; // localStorage

import coverImgReducer from "./Slices/CoverImgSlice";
import galleryLayoutReducer from "./Slices/GalleryLayoutSlice";
import userReducer from "./Slices/UserSlice";
import eventReducer from "./Slices/EventSlice.jsx";
import tabReducer from "./Slices/TabSlice.jsx";

// 🔐 Persist only `authUser` from user slice
const authUserTransform = createTransform(
  (inboundState) => ({
    authUser: inboundState.authUser,
  }),
  (outboundState) => outboundState,
  { whitelist: ["user"] }
);

// 🛠 Persist config with transform
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user"], // Only persist the user slice
  transforms: [authUserTransform], // Only persist authUser from user
};

// 🧠 Combine reducers
const rootReducer = combineReducers({
  user: userReducer,
  galleryLayout: galleryLayoutReducer,
  coverImg: coverImgReducer,
  event: eventReducer,
  tab: tabReducer,
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
