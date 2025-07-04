import React from "react";
import { Loader2, CreditCard } from "lucide-react";

const TransactionProcessingModal = ({ isOpen }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl px-6 py-8 w-full max-w-md text-center animate-fade-in-down">
        {/* Icon with Pulse Ring */}
        <div className="relative flex justify-center mb-6">
          <div className="absolute inset-0 animate-ping-slow rounded-full bg-indigo-100 opacity-70 w-20 h-20 m-auto z-0"></div>
          <div className="relative z-10 p-4 bg-indigo-50 rounded-full">
            <CreditCard className="w-10 h-10 text-indigo-600 animate-bounce-slow" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Processing Payment
        </h2>

        {/* Subtitle */}
        <p className="text-gray-600 text-sm mb-6">
          Please do not refresh or close this window. Your transaction is being securely processed.
        </p>

        {/* Animated Dots Loader */}
        <div className="flex justify-center space-x-2">
          <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
          <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
          <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></span>
        </div>

        {/* Optional progress bar */}
        {/* <div className="mt-6 w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 animate-pulse w-3/4 rounded-full"></div>
        </div> */}
      </div>
    </div>
  );
};

export default TransactionProcessingModal;
