import React, { useState, useEffect, memo } from "react";
import AddPhotosModal from "./AddPhotosModal";
import { useParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { S3_API_END_POINT } from "../../constant";
import apiRequest from "../../utils/apiRequest";
import { Loader } from "../Loader";

const PhotosPanel = () => {
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImages, setSelectedImages] = useState(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tokens, setTokens] = useState({ 1: { original: null, thumbs: null } });
  const [hasNext, setHasNext] = useState(false);
  const { currentSubEvent, currentEventId } = useSelector(
    (state) => state.event
  );
  const { eventId } = useParams();
  const [reloadKey, setReloadKey] = useState(0);
  const dispatch = useDispatch();
  const { accessToken } = useSelector((state) => state.user);

  const pageSize = 25;

  useEffect(() => {
    if (!currentEventId || !currentSubEvent?._id) return;

    setPage(1);
    setTokens({ 1: { original: null, thumbs: null } });
    setSelectedImages(new Set());
    setReloadKey((prev) => prev + 1);
  }, [currentEventId, currentSubEvent]);

  useEffect(() => {
    const fetchImages = async () => {
      const tokenData = tokens[page] || { original: null, thumbs: null };
      const { original, thumbs } = tokenData;

      setIsLoading(true);
      try {
        const endpoint = `${S3_API_END_POINT}/list-images`;
        const res = await apiRequest(
          "POST",
          endpoint,
          {
            eventId,
            continuationTokenOriginal: original,
            continuationTokenThumbs: thumbs,
            pageSize,
            subEventId: currentSubEvent._id,
          },
          accessToken,
          dispatch
        );
        console.log(res);

        console.log({
          page,
          tokenData,
          receivedImages: res.data.images?.length,
          nextOriginal: res.data.nextTokenOriginal,
          nextThumbs: res.data.nextTokenThumbs,
        });

        if (res.status === 200) {
          const data = res.data.images || [];
          const nextToken = {
            original: res.data.nextTokenOriginal,
            thumbs: res.data.nextTokenThumbs,
          };

          setImages(data);

          setHasNext(!!(nextToken.original || nextToken.thumbs));

          if (nextToken.original || nextToken.thumbs) {
            setTokens((prev) => ({
              ...prev,
              [page + 1]: nextToken,
            }));
          }
        }
      } catch (err) {
        console.error("Image load error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (eventId && currentSubEvent?._id) {
      fetchImages();
    }
  }, [page, eventId, currentSubEvent?._id, reloadKey]);

  const triggerRefresh = () => {
    setPage(1);
    setTokens({ 1: { original: null, thumbs: null } });
    setSelectedImages(new Set());
    setReloadKey((prev) => prev + 1);
  };

  const toggleSelect = (img) => {
    setSelectedImages((prev) => {
      const updated = new Set(prev);
      const key = img.originalUrl;
      const alreadySelected = [...prev].some(
        (item) => item.originalUrl === key
      );
      if (alreadySelected) {
        updated.forEach((item) => {
          if (item.originalUrl === key) updated.delete(item);
        });
      } else {
        updated.add(img);
      }
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
    triggerRefresh();
  };

  const eventDate = currentSubEvent?.createdAt
    ? new Date(currentSubEvent.createdAt).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "No Date Provided";

  return (
    <div className="p-2 sm:p-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div className="text-xl font-semibold flex flex-wrap items-center gap-4">
          <p>{currentSubEvent?.subEventName}</p>
          <p className="text-slate-dark text-sm">{eventDate}</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={triggerRefresh}
            className="p-2 rounded-full bg-slate hover:bg-slate-dark text-gray-600 hover:text-white transition"
            title="Refresh"
          >
            <RefreshCw className="w-5 h-5" />
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-primary hover:bg-primary-dark text-white text-sm font-medium px-4 py-2 rounded-md shadow transition"
          >
            + Add Photos
          </button>
        </div>
      </div>

      {images.length > 0 && (
        <div className="flex justify-between items-center mb-4">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={selectAll}
              className="sr-only"
            />
            <div
              className={`w-4 h-4 rounded border-2 flex items-center justify-center transition ${
                allSelected
                  ? "bg-primary border-primary"
                  : "bg-check border-slate-dark"
              }`}
            >
              {allSelected && (
                <svg
                  className="w-3 h-3 text-white"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8.25 8.25a1 1 0 01-1.414 0l-4.25-4.25a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
            <span className="text-sm text-gray-700">
              Select All ({selectedImages.size}/{images.length})
            </span>
          </label>

          <div className="flex gap-6 items-center justify-center mt-4">
            <button
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={page === 1 || isLoading}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition shadow-sm ${
                page === 1 || isLoading
                  ? "bg-slate text-gray-400 cursor-not-allowed"
                  : "bg-primary hover:bg-primary-dark text-white"
              }`}
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
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition shadow-sm ${
                !hasNext || isLoading
                  ? "bg-slate text-gray-400 cursor-not-allowed"
                  : "bg-primary hover:bg-primary-dark text-white"
              }`}
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {images.map((img, index) => (
          <MemoizedImageCard
            key={img.originalUrl + index}
            src={img.thumbnailUrl}
            alt={`Image ${index + 1}`}
            selected={[...selectedImages].some(
              (i) => i.originalUrl === img.originalUrl
            )}
            onToggleSelect={() => toggleSelect(img)}
          />
        ))}
      </div>

      {isLoading ? (
        <Loader message="Images are on their way, please wait..." />
      ) : images.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">
          <p className="text-lg font-medium text-gray-600">
            No photos uploaded yet. Click "+ Add Photos" to get started!
          </p>
        </div>
      ) : null}

      <AddPhotosModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUploadSuccess={handleUploadSuccess}
        currentSubEvent={currentSubEvent}
      />
    </div>
  );
};

const ImageCard = ({ src, alt, selected, onToggleSelect }) => (
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
    <div className="absolute top-2 left-2">
      <label className="inline-flex items-center cursor-pointer bg-transparent bg-opacity-75 p-1 rounded shadow">
        <input
          type="checkbox"
          checked={selected}
          onChange={onToggleSelect}
          className="sr-only"
        />
        <div
          className={`w-4 h-4 rounded border-2 flex items-center justify-center transition ${
            selected
              ? "bg-primary border-primary"
              : "bg-check border-slate-dark"
          }`}
        >
          {selected && (
            <svg
              className="w-3 h-3 text-white"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8.25 8.25a1 1 0 01-1.414 0l-4.25-4.25a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
      </label>
    </div>
  </div>
);

const MemoizedImageCard = memo(ImageCard);
export default PhotosPanel;
