import React, { useState, useEffect, memo } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import AddPhotosModal from "./AddPhotosModal";

const PhotosPanel = () => {
  const [images, setImages] = useState([]);
  const [loadedAll, setLoadedAll] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState(new Set());
  const { singleEvent } = useSelector((state) => state.event);

  // Load all images once
  useEffect(() => {
    if (!singleEvent?._id) return;
    setImages([]);
    setSelectedImages(new Set());
    setLoadedAll(false);
    fetchImages();
  }, [singleEvent]);

  const fetchImages = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:5000/api/v1/list-images",
        {
          params: { eventId: singleEvent._id },
        }
      );

      const allImages = data.images || [];
      setImages(allImages);
      setLoadedAll(true);
    } catch (err) {
      console.error("Error fetching images:", err);
    }
  };

  const toggleSelect = (url) => {
    setSelectedImages((prev) => {
      const updated = new Set(prev);
      updated.has(url) ? updated.delete(url) : updated.add(url);
      return updated;
    });
  };

  const selectAll = (e) => {
    if (e.target.checked) {
      setSelectedImages(new Set(images));
    } else {
      setSelectedImages(new Set());
    }
  };

  const allSelected =
    images.length > 0 && selectedImages.size === images.length;

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

      {images.length > 0 && (
        <div className="mb-3 flex items-center gap-2">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={selectAll}
            className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
          />
          <label className="text-sm text-gray-700">
            Select All ({selectedImages.size}/{images.length})
          </label>
        </div>
      )}

      {images.length > 0 ? (
        <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {images.map((url, index) => (
            <MemoizedImageCard
              key={url + index}
              src={url}
              alt={`Photo ${index + 1}`}
              selected={selectedImages.has(url)}
              onToggleSelect={() => toggleSelect(url)}
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

      <AddPhotosModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUploadSuccess={() => {
          setImages([]);
          setLoadedAll(false);
          setSelectedImages(new Set());
          fetchImages();
        }}
      />
    </div>
  );
};

const ImageCard = ({ src, alt, selected, onToggleSelect }) => {
  const [loaded, setLoaded] = useState(false);
  const handleError = (e) => (e.target.src = "/fallback.jpg");

  return (
    <div
      className={`relative w-full min-w-[180px] max-w-full overflow-hidden rounded-lg shadow group ${
        selected ? "ring-2 ring-primary" : ""
      }`}
    >
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

      {/* Checkbox overlay */}
      <div className="absolute top-2 left-2 bg-white bg-opacity-75 p-1 rounded shadow">
        <input
          type="checkbox"
          checked={selected}
          onChange={onToggleSelect}
          className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
        />
      </div>
    </div>
  );
};

const MemoizedImageCard = memo(ImageCard);

export default PhotosPanel;
