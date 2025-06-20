import React from "react";

const LoaderModal = ({ isOpen, message = "Please wait..." }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center">
      <div style={{width:360}}   className="bg-white/80 border border-gray-200 shadow-2xl rounded-2xl px-8 py-6 flex flex-col items-center gap-4 animate-fadeIn">
        {/* Spinner */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
          <div className="absolute inset-2 bg-white rounded-full"></div>
        </div>

        {/* Text */}
        <p className="text-gray-800 text-lg font-semibold animate-pulse">
          {message}
        </p>
      </div>
    </div>
  );
};

export default LoaderModal;
