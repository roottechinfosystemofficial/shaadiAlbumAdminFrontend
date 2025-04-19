// Redux store setup
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Use localStorage
import { coverImgSlice } from "./Slices/CoverImgSlice";
import { galleryLayoutSlice } from "./Slices/GalleryLayoutSlice";
import { userSlice } from "./Slices/UserSlice";

// Persist configuration
const persistConfig = {
  key: "root", // The key used to store the persisted state
  storage, // Using localStorage
  whitelist: ["user"], // Only persist 'user' slice (optional)
};

const rootReducer = combineReducers({
  user: userSlice.reducer,
  galleryLayout: galleryLayoutSlice.reducer,
  coverImg: coverImgSlice.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializableCheck for redux-persist
    }),
});

const persistor = persistStore(store);

export { store, persistor };
