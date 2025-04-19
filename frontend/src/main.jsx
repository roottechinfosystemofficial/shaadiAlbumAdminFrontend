import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { store, persistor } from "./Redux/Store.js"; // Import store and persistor
import { ToastContainer } from "react-toastify";
import { PersistGate } from "redux-persist/integration/react"; // Import PersistGate from redux-persist

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
      <ToastContainer
        limit={3}
        newestOnTop
        closeButton={false}
        toastClassName="shadow-md"
      />
    </PersistGate>
  </Provider>
);
