import React from "react";
import { AlertOctagon } from "lucide-react";

const SubscriptionDeactivatedModal = ({ isOpen, supportNumber = "7666054838", onClose }) => {
  if (!isOpen) return null;


  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
      <div className="w-[90%] max-w-md bg-gradient-to-br from-red-100 to-orange-100 border border-red-200 shadow-2xl backdrop-blur-xl rounded-3xl p-8 animate-fadeZoomIn text-center">
        {/* Animated Icon */}
        <div className="flex justify-center mb-5">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-red-400 to-orange-400 opacity-30 animate-ping"></div>
            <div className="relative bg-gradient-to-tr from-red-400 to-orange-400 p-4 rounded-full shadow-xl">
              <AlertOctagon className="w-10 h-10 text-white animate-bounce" />
            </div>
          </div>
        </div>

        {/* Message */}
        <h2 className="text-2xl font-bold text-red-700 mb-2">Subscription Deactivated</h2>
        <p className="text-gray-800 text-base mb-4">
          Your subscription has been deactivated.
        </p>
        <p className="text-gray-700 text-sm mb-6">
          Please contact support to renew or activate your plan.
        </p>

        {/* Support Button */}
        <a
          href={`tel:${supportNumber}`}
          className="inline-block mb-3 px-6 py-2 font-semibold rounded-xl text-white bg-gradient-to-r from-orange-500 to-red-500 hover:from-red-600 hover:to-orange-600 transition-all shadow-lg"
        >
          Call Support: {supportNumber}
        </a>

        {/* Close Button */}
       
      </div>
    </div>
  );
};

export default SubscriptionDeactivatedModal;
