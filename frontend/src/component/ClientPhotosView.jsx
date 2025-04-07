import React, { useState } from "react";
import {
  ArrowDownToLineIcon,
  Heart,
  ScanFace,
  Share2,
  ShoppingCart,
  Upload,
  X,
} from "lucide-react";

const ClientPhotosView = () => {
  const adminSettings = {
    spacing: "large",
    layout: "horizontal", // Change to "horizontal" or "vertical"
    thumbnailSize: "large",
    background: "dark",
  };

  const [modalImage, setModalImage] = useState(null);

  const bgClass =
    adminSettings.background === "dark"
      ? "bg-gray-900 text-white"
      : "bg-gray-100 text-gray-900";

  const sampleImages = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    url: `https://picsum.photos/seed/${i}/800/600`,
  }));

  const spacingClasses = {
    small: "gap-2",
    regular: "gap-4",
    large: "gap-6",
  };

  const layoutClasses = {
    vertical: "columns-1 sm:columns-2 md:columns-3", // Masonry-style
    horizontal: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4", // Regular grid
  };

  const thumbSizeClasses = {
    small: "h-32",
    regular: "h-48",
    large: "h-64",
  };

  const closeModal = () => setModalImage(null);

  return (
    <div className={`${bgClass} min-h-screen w-full py-6`}>
      <div className="max-w-[95%] mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-6 gap-4">
          <div>
            <h2 className="text-2xl font-bold">RAHUL</h2>
            <p className="text-sm text-gray-500">dyhrf</p>
          </div>
          <div className="flex flex-wrap gap-3 text-black">
            {[
              { icon: <ScanFace className="w-5 h-5" />, label: "Face Search" },
              { icon: <Heart className="w-5 h-5" />, label: "Favourites" },
              { icon: <Upload className="w-5 h-5" /> },
              { icon: <ShoppingCart className="w-5 h-5" /> },
              { icon: <Share2 className="w-5 h-5" /> },
              { icon: <ArrowDownToLineIcon className="w-5 h-5" /> },
            ].map((btn, index) => (
              <button
                key={index}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-white border rounded shadow hover:bg-gray-200 transition"
              >
                {btn.icon}
                {btn.label && <span>{btn.label}</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Highlights Title */}
        <div className="mb-4">
          <h3 className="text-xl md:text-2xl font-semibold">Highlights</h3>
        </div>

        {/* Image Gallery */}
        <div
          className={`${layoutClasses[adminSettings.layout]} ${
            spacingClasses[adminSettings.spacing]
          }`}
        >
          {sampleImages.map((img) => (
            <div
              key={img.id}
              className={`mb-4 ${
                adminSettings.layout === "vertical" ? "break-inside-avoid" : ""
              } rounded overflow-hidden bg-white shadow hover:shadow-lg transition duration-300 cursor-pointer`}
              onClick={() => setModalImage(img.url)}
            >
              <img
                src={img.url}
                alt={`sample-${img.id}`}
                className={`w-full object-cover ${
                  thumbSizeClasses[adminSettings.thumbnailSize]
                }`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Fullscreen Modal */}
      {modalImage && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center transition duration-300"
          onClick={closeModal}
        >
          <div className="relative max-w-5xl max-h-[90vh] w-full px-4">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-white bg-black bg-opacity-50 rounded-full p-1 hover:bg-opacity-80"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={modalImage}
              alt="Full view"
              className="w-full max-h-[90vh] object-contain mx-auto rounded transition-transform duration-300 ease-in-out"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientPhotosView;
