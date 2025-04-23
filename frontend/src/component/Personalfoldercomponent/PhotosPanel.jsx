import React, { useState, useEffect, memo } from "react";
import axios from "axios";
import AddPhotosModal from "./AddPhotosModal";
import { useParams } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PhotosPanel = () => {
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImages, setSelectedImages] = useState(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tokens, setTokens] = useState({ 1: null }); // page => continuationToken
  const [hasNext, setHasNext] = useState(false);
  const { eventId } = useParams();
  const [pageSize, setPageSize] = useState(100);

  useEffect(() => {
    if (!eventId) return;
    setImages([]);
    setPage(1);
    setSelectedImages(new Set());
    setTokens({ 1: null });
  }, [eventId]);

  useEffect(() => {
    if (!eventId) return;
    const continuationToken = tokens[page];

    setIsLoading(true);
    axios
      .get("http://localhost:5000/api/v1/list-images", {
        params: { eventId, continuationToken, pageSize },
      })
      .then((res) => {
        const data = res.data.images || [];
        const nextToken = res.data.nextToken;

        setImages(data);
        setHasNext(!!nextToken);

        if (nextToken) {
          setTokens((prev) => ({
            ...prev,
            [page + 1]: nextToken,
          }));
        }
      })
      .catch((err) => console.error("Image load error:", err))
      .finally(() => setIsLoading(false));
  }, [page, eventId]);

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

  const handleUploadSuccess = () => {
    setPage(1);
    setTokens({ 1: null });
  };

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
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={selectAll}
              className="h-4 w-4 text-primary border-gray-300 rounded"
            />
            <span className="text-sm text-gray-700">
              Select All ({selectedImages.size}/{images.length})
            </span>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={page === 1 || isLoading}
              className="flex items-center gap-2 px-4 py-2 border rounded-full text-sm font-medium transition disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>
            <span className="text-sm font-medium text-gray-700">
              Page {page}
            </span>
            <button
              onClick={() => setPage((prev) => prev + 1)}
              disabled={!hasNext || isLoading}
              className="flex items-center gap-2 px-4 py-2 border rounded-full text-sm font-medium transition disabled:opacity-50"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {images.map((url, index) => (
          <MemoizedImageCard
            key={url + index}
            src={url}
            alt={`Image ${index + 1}`}
            selected={selectedImages.has(url)}
            onToggleSelect={() => toggleSelect(url)}
          />
        ))}
      </div>

      {isLoading && (
        <div className="flex justify-center mt-6 text-gray-400 animate-pulse">
          <p>Loading images...</p>
        </div>
      )}
      {!isLoading && images.length === 0 && (
        <div className="text-center text-gray-500 mt-10">
          <p className="text-lg font-medium">No photos available.</p>
        </div>
      )}

      <AddPhotosModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUploadSuccess={handleUploadSuccess}
      />
    </div>
  );
};

const ImageCard = ({ src, alt, selected, onToggleSelect }) => {
  return (
    <div
      className={`relative overflow-hidden rounded-lg shadow group ${
        selected ? "ring-2 ring-primary" : ""
      }`}
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="w-full h-64 object-contain transition-transform duration-200 ease-in-out group-hover:scale-105"
      />
      <div className="absolute top-2 left-2 bg-white bg-opacity-75 p-1 rounded shadow">
        <input
          type="checkbox"
          checked={selected}
          onChange={onToggleSelect}
          className="h-4 w-4 text-primary border-gray-300 rounded"
        />
      </div>
    </div>
  );
};

const MemoizedImageCard = memo(ImageCard);
export default PhotosPanel;
