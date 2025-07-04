import React from "react";
import { CheckCircle2, Sparkles, Printer } from "lucide-react";

const SubscriptionConfirmedModal = ({ isOpen, onClose, onContinue, onPrint }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="relative w-full max-w-md p-8 bg-white rounded-2xl shadow-xl animate-fade-in-down text-center">
        {/* Close (X) */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition text-xl"
        >
          ×
        </button>

        {/* Animated Icon */}
        <div className="flex justify-center mb-4">
          <CheckCircle2
            size={72}
            className="text-green-500 animate-pulse drop-shadow-lg"
          />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Subscription Confirmed!
        </h2>

        {/* Subtext */}
        <p className="text-gray-600 mb-6">
          You have successfully subscribed to your selected plan. 🎉
        </p>

        {/* Sparkles Row */}
        <div className="flex justify-center mb-4">
          <Sparkles className="text-yellow-400 animate-bounce-slow" size={28} />
          <Sparkles className="text-indigo-400 animate-bounce-slow mx-2" size={28} />
          <Sparkles className="text-pink-400 animate-bounce-slow" size={28} />
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={onContinue}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-rose-500 text-white rounded-full font-semibold shadow-md transition-transform hover:scale-105"
          >
            Continue
          </button>

          <button
            onClick={onPrint}
            className="px-6 py-3 bg-white border border-gray-300 text-gray-800 rounded-full font-semibold shadow-sm hover:shadow-md transition hover:scale-105 flex items-center justify-center gap-2"
          >
            <Printer className="w-5 h-5" />
            Print Receipt
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionConfirmedModal;
