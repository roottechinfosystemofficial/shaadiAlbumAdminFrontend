import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import toast from "../utils/toast.js";
import Loader from "../component/Loader.jsx";
const FavouritePanel = () => {
  const { currentSubEvent } = useSelector((state) => state.event);
  console.log(currentSubEvent?.clientSelectedImages);

  const selectedImages = currentSubEvent?.clientSelectedImages || [];

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (selectedImages.length === 0) {
      setIsLoading(false); // Stop loading once images are fetched
    } else {
      setIsLoading(false); // Simulate loading when images are fetched
    }
  }, [selectedImages]);

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div className="text-xl font-semibold flex flex-wrap items-center gap-4">
          <p>{currentSubEvent?.subEventName}</p>
        </div>
      </div>

      {/* Display loading state */}
      {isLoading ? (
        <div className="flex justify-center items-center py-4">
          <Loader message="Loading your favorite images..." />
        </div>
      ) : (
        <div>
          {/* No images available state */}
          {selectedImages.length === 0 ? (
            <div className="text-center text-gray-500 py-10">
              <p>
                No images available. Please select images to add to favorites.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {selectedImages.map((image, index) => (
                <div
                  key={image._id || index}
                  className="relative border rounded-xl overflow-hidden shadow-lg hover:scale-105 transform transition-all duration-300"
                >
                  <img
                    src={image.thumbnailUrl}
                    alt={`Selected ${index}`}
                    className="w-full h-96 object-cover"
                  />
                  {/* Optionally add hover actions like remove */}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default FavouritePanel;
