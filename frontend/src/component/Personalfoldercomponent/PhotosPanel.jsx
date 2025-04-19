import React, { useState, useEffect, useRef, memo } from "react";
import AddPhotosModal from "./AddPhotosModal";

const totalImages = 129;
const batchSize = 6;

const getImageUrls = (start, count) => {
  return Array.from({ length: count }, (_, i) => {
    const imageIndex = start + i + 1;
    const imageName = `img (${imageIndex})`;
    return `https://res.cloudinary.com/dzfaikj95/image/upload/w_500,c_scale/shaadialum/${imageName}.jpg`;
  });
};

const PhotosPanel = () => {
  const [visibleImages, setVisibleImages] = useState([]);
  const [loadedAll, setLoadedAll] = useState(false);
  const loaderRef = useRef(null);
  const observerRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setVisibleImages(getImageUrls(0, batchSize));
  }, []);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadedAll) {
          requestIdleCallback(() => loadMoreImages());
        }
      },
      { rootMargin: "150px" }
    );

    if (loaderRef.current) observerRef.current.observe(loaderRef.current);

    return () => {
      if (observerRef.current && loaderRef.current) {
        observerRef.current.unobserve(loaderRef.current);
        observerRef.current.disconnect();
      }
    };
  }, [visibleImages, loadedAll]);

  const loadMoreImages = () => {
    const current = visibleImages.length;
    if (current >= totalImages) {
      setLoadedAll(true);
      return;
    }

    const nextBatch = getImageUrls(
      current,
      Math.min(batchSize, totalImages - current)
    );
    setVisibleImages((prev) => [...prev, ...nextBatch]);
  };

  return (
    <div className="p-2 sm:p-4">
      {/* Header with Add Photos Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Photos</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary hover:bg-primary-dark text-white text-sm font-medium px-4 py-2 rounded-md shadow transition"
        >
          + Add Photos
        </button>
      </div>

      {/* Responsive Photo Grid */}
      <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {visibleImages.map((photo, index) => (
          <MemoizedImageCard
            key={photo}
            src={photo}
            alt={`Photo ${index + 1}`}
          />
        ))}
      </div>

      {/* Loader */}
      {!loadedAll && (
        <div ref={loaderRef} className="text-center mt-6 text-gray-500">
          Loading more images...
        </div>
      )}

      {/* Add Photo Modal */}
      <AddPhotosModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

const ImageCard = ({ src, alt }) => {
  const [loaded, setLoaded] = useState(false);

  const handleError = (e) => {
    e.target.src = "/fallback.jpg"; // Replace with your fallback image path
  };

  return (
    <div className="w-full min-w-[180px] max-w-full overflow-hidden rounded-lg shadow relative group">
      <div className="relative aspect-[4/3] bg-gray-100">
        <img
          loading="lazy"
          src={src}
          alt={alt}
          onLoad={() => setLoaded(true)}
          onError={handleError}
          className={`absolute inset-0 w-full h-full object-cover transition duration-300 ease-in-out transform ${
            loaded ? "opacity-100 scale-100" : "opacity-0"
          } group-hover:scale-105`}
        />
        {!loaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg" />
        )}
      </div>
    </div>
  );
};

const MemoizedImageCard = memo(ImageCard);

export default PhotosPanel;
