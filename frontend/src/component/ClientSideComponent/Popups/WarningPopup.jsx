import React from "react";
import { AlertTriangle } from "lucide-react";

const WarningPopup = ({ isOpen, onClose, title = "Warning", message = "Something went wrong!" }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Box */}
      <div className="relative bg-white rounded-2xl shadow-lg w-full max-w-md p-6 z-50 animate-fade-in">
        <div className="flex items-start gap-4">
          <div className="bg-yellow-100 text-yellow-600 rounded-full p-3">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            <p className="text-sm text-gray-600 mt-1">{message}</p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium bg-yellow-500 hover:bg-yellow-600 text-white rounded-md"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default WarningPopup;
