// src/utils/customToast.js
import { toast as originalToast } from "react-toastify";

// Base styling for all toasts
const baseStyle = {
  borderRadius: "14px",
  fontSize: "14.5px",
  fontWeight: "500",
  padding: "12px 16px",
  minHeight: "60px", // Consistent height
  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.08)", // Soft shadow
  fontFamily: "'Inter', 'Roboto', 'Helvetica Neue', sans-serif",
  display: "flex",
  alignItems: "center",
};

// Common toast config
const toastConfig = {
  position: "top-center",
  autoClose: 1800,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: false,
  theme: "light",
};

// Wrapper function
const toast = (message, options = {}) =>
  originalToast(message, {
    ...toastConfig,
    ...options,
    style: {
      ...baseStyle,
      ...options.style,
    },
  });

// Customized toast types
toast.success = (message, options = {}) =>
  originalToast(message, {
    ...toastConfig,
    ...options,
    type: "success",
    icon: "🎉",
    style: {
      ...baseStyle,
      backgroundColor: "#F0FAF4",
      color: "#146C43",
      ...options.style,
    },
  });

toast.error = (message, options = {}) =>
  originalToast(message, {
    ...toastConfig,
    ...options,
    type: "error",
    icon: "🚫",
    style: {
      ...baseStyle,
      backgroundColor: "#FEF1F2",
      color: "#B42318",
      ...options.style,
    },
  });

toast.info = (message, options = {}) =>
  originalToast(message, {
    ...toastConfig,
    ...options,
    type: "info",
    icon: "💬",
    style: {
      ...baseStyle,
      backgroundColor: "#EEF4FF",
      color: "#175CD3",
      ...options.style,
    },
  });

toast.warn = (message, options = {}) =>
  originalToast(message, {
    ...toastConfig,
    ...options,
    type: "warning",
    icon: "⚡",
    style: {
      ...baseStyle,
      backgroundColor: "#FFFAEB",
      color: "#B54708",
      ...options.style,
    },
  });

toast.loading = (message, options = {}) =>
  originalToast(message, {
    ...toastConfig,
    ...options,
    type: "loading",
    icon: "⏳",
    style: {
      ...baseStyle,
      backgroundColor: "#F1F4F8",
      color: "#6366F1",
      ...options.style,
    },
  });

toast.dismiss = () => {
  originalToast.dismiss();
};

export default toast;
