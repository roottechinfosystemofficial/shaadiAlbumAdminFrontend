import React from "react";
import { useSelector } from "react-redux";

const FavouritePanel = () => {
  const { currentSubEvent } = useSelector((state) => state.event);
  const selectedImages = currentSubEvent?.clientSelectedImages || [];

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div className="text-xl font-semibold flex flex-wrap items-center gap-4">
          <p>{currentSubEvent?.subEventName}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {selectedImages.map((image, index) => (
          <div
            key={image._id || index}
            className="border rounded-xl overflow-hidden shadow hover:scale-105 transition-transform"
          >
            <img
              src={image.thumbnailUrl}
              alt={`Selected ${index}`}
              className="w-full h-48 object-cover"
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default FavouritePanel;
