// components/CreateSubscriptionModal.tsx
import React from "react";
import { X, Star } from "lucide-react";
import clsx from "clsx";



const CreateSubscriptionModal= ({
  isOpen,
  onClose,
  onCreate,
  selectedPlan,
}) => {
  if (!isOpen || !selectedPlan) return null;

  const Icon = selectedPlan.icon;

  // Extract prefill details from features
  const parseFeature = (featureName, keyword) =>
    featureName.toLowerCase().includes(keyword.toLowerCase());

  const getLimit = (keyword) => {
    const found = selectedPlan.features.find((f) =>
      parseFeature(f, keyword)
    );
    return found?.match(/\d+/)?.[0] || "Unlimited";
  };

  const priceAmount = selectedPlan.price;
  const durationInMonths = selectedPlan.price.includes("Year")
    ? 12
    : selectedPlan.price.includes("6 Months")
    ? 6
    : 3;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="relative w-full max-w-xl p-6 bg-white rounded-2xl shadow-xl animate-fade-in-down">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500 transition"
        >
          <X size={22} />
        </button>

        {/* Modal Title */}
        <div className="flex justify-center mb-6">
  <div className="flex items-center space-x-3">
    <Icon
      className={`text-white p-1 rounded-full w-9 h-9 bg-gradient-to-r ${selectedPlan.gradient}`}
    />
    <h2 className="text-2xl font-semibold text-gray-800 text-center">
      Subscription Details: {selectedPlan.name}
    </h2>
  </div>
</div>


        {/* Prefilled Fields */}
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
          <div className="input-style bg-gray-50">
            <label className="block text-xs text-gray-500">Plan Name</label>
            {selectedPlan.name}
          </div>
          <div className="input-style bg-gray-50">
            <label className="block text-xs text-gray-500">Price</label>
            {priceAmount}
          </div>
          <div className="input-style bg-gray-50">
            <label className="block text-xs text-gray-500">Storage</label>
            {getLimit("storage")} GB
          </div>
          <div className="input-style bg-gray-50">
            <label className="block text-xs text-gray-500">Face Recognition</label>
            {getLimit("face recognition")}
          </div>
          <div className="input-style bg-gray-50">
            <label className="block text-xs text-gray-500">QR Code Design</label>
            {getLimit("qr code")}
          </div>
          <div className="input-style bg-gray-50">
            <label className="block text-xs text-gray-500">eAlbum</label>
            {getLimit("e-album")}
          </div>
          <div className="input-style bg-gray-50">
            <label className="block text-xs text-gray-500">CRM Access</label>
            {selectedPlan.features.some((f) => f.toLowerCase().includes("crm")) ? "Yes" : "No"}
          </div>
          <div className="input-style bg-gray-50">
            <label className="block text-xs text-gray-500">Watermark Access</label>
            {selectedPlan.features.some((f) => f.toLowerCase().includes("watermark")) ? "Yes" : "No"}
          </div>
          <div className="input-style bg-gray-50">
            <label className="block text-xs text-gray-500">Album Photo Selection</label>
            {selectedPlan.features.some((f) => f.toLowerCase().includes("photo selection")) ? "Yes" : "No"}
          </div>
          <div className="input-style bg-gray-50">
            <label className="block text-xs text-gray-500">Image Download Control</label>
            {selectedPlan.features.some((f) => f.toLowerCase().includes("download control")) ? "Yes" : "No"}
          </div>
          <div className="input-style bg-gray-50 col-span-2">
            <label className="block text-xs text-gray-500">Duration</label>
            {durationInMonths} Month(s)
          </div>
        </div>

        {/* Confirm Button */}
        <div className="mt-6 text-right">
          <button
            onClick={onCreate}
            className={clsx(
              "inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full shadow-md transition-transform hover:scale-105 hover:shadow-lg"
            )}
          >
            <Star className="mr-2 animate-bounce" size={20} />
            Confirm Subscription
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateSubscriptionModal;
