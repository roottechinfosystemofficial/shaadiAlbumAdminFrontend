import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { store, persistor } from "./Redux/Store.js"; // Import store and persistor
import { ToastContainer, Slide } from "react-toastify";
import { PersistGate } from "redux-persist/integration/react"; // Import PersistGate from redux-persist

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
      <ToastContainer
        position="top-center"
        autoClose={1800}
        hideProgressBar
        transition={Slide} // 👈 SMOOTH slide in and out
        closeOnClick
        draggable={false}
        theme="light"
      />
    </PersistGate>
  </Provider>
);
