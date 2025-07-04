import React from "react";
import { LoaderCircle } from "lucide-react";

const LoaderModal = ({ isOpen, message = "Please wait..." }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center">
      <div className="relative w-[420px] sm:w-[480px] bg-white/90 backdrop-blur-xl rounded-3xl border border-white/30 shadow-2xl p-10 sm:p-12 flex flex-col items-center gap-8 animate-fadeZoomIn">
        {/* Spinner with glowing ring */}
        <div className="relative w-20 h-20 flex items-center justify-center">
          <div className="absolute w-full h-full rounded-full bg-gradient-to-tr from-blue-400 to-purple-500 opacity-30 animate-ping"></div>
          <LoaderCircle className="h-14 w-14 text-blue-600 animate-spin" />
        </div>

        {/* Message */}
        <p className="text-center text-gray-800 font-semibold text-xl animate-pulse">
          {message}
        </p>
      </div>
    </div>
  );
};

export default LoaderModal;
