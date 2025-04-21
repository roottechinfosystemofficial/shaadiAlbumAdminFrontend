import React, { useState, useEffect, useRef } from "react";
import {
  ArrowDownToLineIcon,
  Heart,
  ScanFace,
  Share2,
  ShoppingCart,
  Upload,
  X,
  ArrowLeftCircle,
  ArrowRightCircle,
  RotateCw,
  FlipHorizontal,
} from "lucide-react";
import { useSelector } from "react-redux";
import axios from "axios";

const ClientPhotosView = ({ setWhichView }) => {
  const { layout, spacing, thumbnail, background } = useSelector(
    (state) => state.galleryLayout
  );

  const adminSettings = {
    spacing: spacing || "large",
    layout: layout || "vertical",
    thumbnail: thumbnail || "large",
    background: background || "light",
  };

  const [imageUrls, setImageUrls] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [modalImage, setModalImage] = useState(null);
  const [rotation, setRotation] = useState(0);
  const [flip, setFlip] = useState(false);
  const [isSlideshow, setIsSlideshow] = useState(false);
  const [slideshowInterval, setSlideshowInterval] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const loaderRef = useRef(null);
  const observerRef = useRef(null);

  const bgClass =
    adminSettings.background === "dark"
      ? "bg-black text-white"
      : "bg-white text-gray-900";

  const spacingClasses = {
    small: "gap-2",
    regular: "gap-4",
    large: "gap-6",
  };

  const layoutClasses = {
    vertical: "columns-1 sm:columns-2 md:columns-3",
    horizontal: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4",
  };

  const fetchImages = async () => {
    try {
      const res = await axios.get(`/api/images?page=${page}`);
      const newImages = res.data.images;

      setImageUrls((prev) => [...prev, ...newImages]);
      setPage((prev) => prev + 1);
      if (newImages?.length === 0) setHasMore(false);
    } catch (err) {
      console.error("Error fetching images:", err);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchImages();
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
  }, [imageUrls, hasMore]);

  const closeModal = () => {
    setModalImage(null);
    setRotation(0);
    setFlip(false);
    if (isSlideshow) {
      clearInterval(slideshowInterval);
      setSlideshowInterval(null);
      setIsSlideshow(false);
    }
  };

  const goBack = () => {
    setWhichView("");
  };

  const stopSlideshowIfRunning = () => {
    if (isSlideshow) {
      clearInterval(slideshowInterval);
      setSlideshowInterval(null);
      setIsSlideshow(false);
    }
  };

  const handleNextImage = () => {
    stopSlideshowIfRunning();
    setCurrentImageIndex((prevIndex) => {
      const nextIndex = (prevIndex + 1) % imageUrls?.length;
      setModalImage(imageUrls[nextIndex]);
      setRotation(0);
      setFlip(false);
      return nextIndex;
    });
  };

  const handlePreviousImage = () => {
    stopSlideshowIfRunning();
    setCurrentImageIndex((prevIndex) => {
      const prev = (prevIndex - 1 + imageUrls?.length) % imageUrls?.length;
      setModalImage(imageUrls[prev]);
      setRotation(0);
      setFlip(false);
      return prev;
    });
  };

  const toggleSlideshow = () => {
    if (isSlideshow) {
      clearInterval(slideshowInterval);
      setSlideshowInterval(null);
    } else {
      const interval = setInterval(handleNextImage, 2000);
      setSlideshowInterval(interval);
    }
    setIsSlideshow(!isSlideshow);
  };

  const rotateImage = (e) => {
    e.stopPropagation();
    setRotation((prev) => prev + 90);
  };

  const flipImage = (e) => {
    e.stopPropagation();
    setFlip((prev) => !prev);
  };

  return (
    <div className={`${bgClass} min-h-screen w-full py-6`}>
      <div className="max-w-[95%] mx-auto px-4">
        <button
          onClick={goBack}
          className="flex items-center gap-2 px-3 py-2 text-sm bg-white border rounded shadow hover:bg-gray-200 transition mb-4"
        >
          <span className="text-black">&larr; Back</span>
        </button>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-6 gap-4">
          <div>
            <h2 className="text-2xl font-bold">Dhruv</h2>
            <p className="text-sm text-gray-500">dyhrf</p>
          </div>
          <div className="flex flex-wrap gap-3 text-black">
            {[
              ScanFace,
              Heart,
              Upload,
              ShoppingCart,
              Share2,
              ArrowDownToLineIcon,
            ].map((Icon, i) => (
              <button
                key={i}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-white border rounded shadow hover:bg-gray-200 transition"
              >
                <Icon className="w-5 h-5" />
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <h3 className="text-xl md:text-2xl font-semibold">Highlights</h3>
        </div>

        <div
          className={`${layoutClasses[adminSettings.layout]} ${
            spacingClasses[adminSettings.spacing]
          }`}
        >
          {imageUrls.map((url, index) => (
            <div
              key={url}
              className={`mb-4 ${
                adminSettings.layout === "vertical" ? "break-inside-avoid" : ""
              } rounded overflow-hidden bg-white shadow hover:shadow-lg transition duration-300 cursor-pointer`}
              onClick={() => {
                setModalImage(url);
                setCurrentImageIndex(index);
              }}
            >
              <img
                src={url}
                alt={`img-${index}`}
                className="w-full h-auto rounded"
              />
            </div>
          ))}
        </div>

        {hasMore && (
          <div ref={loaderRef} className="text-center py-6 text-gray-500">
            Loading more images...
          </div>
        )}
      </div>

      {modalImage && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center transition duration-300"
          onClick={closeModal}
        >
          <div className="relative max-w-5xl max-h-[90vh] w-full px-4">
            <div
              className="relative mx-auto rounded transition-transform duration-300 ease-in-out"
              style={{
                transform: `rotate(${rotation}deg) scaleX(${flip ? -1 : 1})`,
              }}
            >
              <img
                src={modalImage}
                alt="Full view"
                className="w-full max-h-[90vh] object-contain mx-auto"
              />
              <button
                onClick={closeModal}
                className="absolute bg-slate rounded-md text-black font-bold top-0 right-0 cursor-pointer p-3"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex gap-4">
              <button
                onClick={rotateImage}
                className="p-2 bg-white text-black rounded-full shadow hover:bg-gray-200"
              >
                <RotateCw className="w-6 h-6" />
              </button>
              <button
                onClick={flipImage}
                className="p-2 bg-white text-black rounded-full shadow hover:bg-gray-200"
              >
                <FlipHorizontal className="w-6 h-6" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSlideshow();
                }}
                className="p-2 bg-white text-black rounded-full shadow hover:bg-gray-200 text-sm font-medium"
              >
                {isSlideshow ? "Stop" : "Start"} Slideshow
              </button>
            </div>

            <div className="absolute top-1/2 left-0 transform -translate-y-1/2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePreviousImage();
                }}
                className="p-3 bg-white text-black rounded-full shadow hover:bg-gray-200"
              >
                <ArrowLeftCircle className="w-8 h-8" />
              </button>
            </div>
            <div className="absolute top-1/2 right-0 transform -translate-y-1/2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextImage();
                }}
                className="p-3 bg-white text-black rounded-full shadow hover:bg-gray-200"
              >
                <ArrowRightCircle className="w-8 h-8" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientPhotosView;
