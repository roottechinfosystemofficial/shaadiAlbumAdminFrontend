// src/utils/customToast.js
import { toast } from "react-toastify";

// Global default config
const baseStyle = {
  borderRadius: "10px",
  fontSize: "15px",
  fontWeight: "500",
  padding: "12px 16px",
};

const toastConfig = {
  position: "top-center",
  autoClose: 1500,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: false,
  theme: "light",
};

// Patch global toast styles
toast.success = (message, options = {}) =>
  toast(message, {
    ...toastConfig,
    ...options,
    type: "success",
    icon: "✅",
    style: {
      ...baseStyle,
      backgroundColor: "#E6F4EA",
      color: "#1F513F",
      ...options.style,
    },
  });

toast.error = (message, options = {}) =>
  toast(message, {
    ...toastConfig,
    ...options,
    type: "error",
    icon: "❌",
    style: {
      ...baseStyle,
      backgroundColor: "#FDECEA",
      color: "#611A15",
      ...options.style,
    },
  });

toast.info = (message, options = {}) =>
  toast(message, {
    ...toastConfig,
    ...options,
    type: "info",
    icon: "ℹ️",
    style: {
      ...baseStyle,
      backgroundColor: "#E8F0FE",
      color: "#1A3A6E",
      ...options.style,
    },
  });

toast.warn = (message, options = {}) =>
  toast(message, {
    ...toastConfig,
    ...options,
    type: "warning",
    icon: "⚠️",
    style: {
      ...baseStyle,
      backgroundColor: "#FFF4E5",
      color: "#663C00",
      ...options.style,
    },
  });

export default toast;
