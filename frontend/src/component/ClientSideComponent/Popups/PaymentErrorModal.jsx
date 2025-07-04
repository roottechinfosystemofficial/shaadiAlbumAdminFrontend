import React from "react";
import { XCircle } from "lucide-react";

const PaymentFailedModal = ({ isOpen, onRetry,message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl px-6 py-8 w-full max-w-md text-center animate-fade-in-down">
        {/* Icon with Red Pulse Ring */}
        <div className="relative flex justify-center mb-6">
          <div className="absolute inset-0 animate-ping-slow rounded-full bg-red-100 opacity-70 w-20 h-20 m-auto z-0"></div>
          <div className="relative z-10 p-4 bg-red-50 rounded-full">
            <XCircle className="w-10 h-10 text-red-600 animate-wiggle" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
         {message ?? "Payment Failed"} 
        </h2>

        {/* Subtitle */}
        <p className="text-gray-600 text-sm mb-6">
          Something went wrong while processing your payment. Please try again or choose a different method.
        </p>

        {/* Animated Dots */}
        <div className="flex justify-center space-x-2 mb-4">
          <span className="w-2 h-2 bg-red-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
          <span className="w-2 h-2 bg-red-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
          <span className="w-2 h-2 bg-red-500 rounded-full animate-bounce"></span>
        </div>

        {/* Retry Button */}
        <button
          onClick={onRetry}
          className="mt-4 px-6 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition duration-200 shadow-md"
        >
          Retry Payment
        </button>
      </div>
    </div>
  );
};

export default PaymentFailedModal;
