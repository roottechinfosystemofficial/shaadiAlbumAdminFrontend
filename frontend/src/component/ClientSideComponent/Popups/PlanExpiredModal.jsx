import React, { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";

const PlanExpiredPopup = ({ isOpen, onUpgrade,onDismiss }) => {
 
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-fadeIn text-center">
        {/* Icon with Pulse */}
        <div className="flex justify-center mb-4">
          <AlertTriangle className="text-red-500 animate-pulse" size={48} />
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          Your Plan Has Expired
        </h2>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-6">
          Your subscription is no longer active. Upgrade your plan to continue accessing premium features.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <button
            onClick={onUpgrade}
            className="bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white font-semibold py-2 px-6 rounded-xl hover:opacity-90 transition"
          >
            Upgrade Plan
          </button>
          {/* <button
            onClick={onDismiss}
            className="border border-gray-300 text-gray-600 font-medium py-2 px-6 rounded-xl hover:bg-gray-100 transition"
          >
            Dismiss
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default PlanExpiredPopup;
