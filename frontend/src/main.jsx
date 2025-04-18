import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { store } from "./Redux/Store.js";
import { ToastContainer } from "react-toastify";
createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <App />
    <ToastContainer
      limit={3}
      newestOnTop
      closeButton={false}
      toastClassName="shadow-md"
    />
  </Provider>
);
