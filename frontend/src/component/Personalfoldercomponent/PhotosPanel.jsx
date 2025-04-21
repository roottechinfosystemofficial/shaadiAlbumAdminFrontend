import React, { useState, useEffect, useRef, memo } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import AddPhotosModal from "./AddPhotosModal";

const batchSize = 6;

const PhotosPanel = () => {
  const [images, setImages] = useState([]);
  const [loadedAll, setLoadedAll] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const loaderRef = useRef(null);
  const observerRef = useRef(null);
  const { singleEvent } = useSelector((state) => state.event);

  // Load initial batch
  useEffect(() => {
    if (!singleEvent?._id) return;
    setImages([]);
    setLoadedAll(false);
    fetchImages(0);
  }, [singleEvent]);

  const fetchImages = async (offset) => {
    try {
      const { data } = await axios.get(
        "http://localhost:5000/api/v1/list-images",
        {
          params: {
            eventId: singleEvent._id,
            offset,
            limit: batchSize,
          },
        }
      );

      const newImages = data.images || [];
      const uniqueNewImages = newImages.filter((url) => !images.includes(url));

      if (uniqueNewImages.length < batchSize) setLoadedAll(true);

      setImages((prev) => [...prev, ...uniqueNewImages]);
    } catch (err) {
      console.error("Error fetching images:", err);
    }
  };

  // Infinite scroll
  useEffect(() => {
    if (!singleEvent?._id) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadedAll) {
          fetchImages(images.length);
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
  }, [images, loadedAll, singleEvent]);

  return (
    <div className="p-2 sm:p-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Photos</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary hover:bg-primary-dark text-white text-sm font-medium px-4 py-2 rounded-md shadow transition"
        >
          + Add Photos
        </button>
      </div>

      {images.length > 0 ? (
        <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {images.map((url, index) => (
            <MemoizedImageCard
              key={url + index}
              src={url}
              alt={`Photo ${index + 1}`}
            />
          ))}
        </div>
      ) : loadedAll ? (
        <div className="flex flex-col items-center justify-center text-gray-500 mt-10">
          <p className="text-lg font-medium">No photos added yet.</p>
          <p className="text-sm">
            Click "Add Photos" to upload your first image.
          </p>
        </div>
      ) : (
        <div className="flex justify-center mt-10 text-gray-400 animate-pulse">
          <p>Loading images...</p>
        </div>
      )}

      {!loadedAll && images.length > 0 && (
        <div ref={loaderRef} className="text-center mt-6 text-gray-500">
          Loading more images...
        </div>
      )}

      <AddPhotosModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUploadSuccess={() => {
          setImages([]);
          setLoadedAll(false);
          fetchImages(0);
        }}
      />
    </div>
  );
};

const ImageCard = ({ src, alt }) => {
  const [loaded, setLoaded] = useState(false);
  const handleError = (e) => (e.target.src = "/fallback.jpg");

  return (
    <div className="w-full min-w-[180px] max-w-full overflow-hidden rounded-lg shadow relative group">
      <div className="relative h-[300px]">
        <img
          loading="lazy"
          src={src}
          alt={alt}
          onLoad={() => setLoaded(true)}
          onError={handleError}
          className={`absolute inset-0 w-full h-full object-contain transition duration-300 ease-in-out transform ${
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
