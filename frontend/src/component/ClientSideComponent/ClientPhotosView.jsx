import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {
  ScanFace,
  Heart,
  Upload,
  ShoppingCart,
  Share2,
  ArrowDownToLineIcon,
} from "lucide-react";

const ClientPhotosView = ({ singleEvent, setSingleEvent }) => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [loadedAll, setLoadedAll] = useState(false);
  const [page, setPage] = useState(1);
  const [loadingImages, setLoadingImages] = useState(true); // Track image loading status

  useEffect(() => {
    if (!eventId) return;
    setImages([]);
    setLoadedAll(false);
    setPage(1);
    setLoadingImages(true); // Start loading images
    fetchEvent();
  }, [eventId]);

  useEffect(() => {
    if (!eventId) return;
    fetchImages();
  }, [page, eventId]);

  const fetchEvent = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:5000/api/v1/events/${eventId}`
      );
      setSingleEvent(data.event);
    } catch (err) {
      console.error("Error fetching event:", err);
    }
  };

  const fetchImages = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:5000/api/v1/list-images",
        {
          params: { eventId: eventId, page, limit: 10 },
        }
      );

      const allImages = (data.images || []).filter(
        (img) => typeof img === "string" && img.trim() !== ""
      );

      // Replace images on first page, append for subsequent pages
      setImages((prevImages) =>
        page === 1 ? allImages : [...prevImages, ...allImages]
      );

      if (allImages.length < 30) {
        setLoadedAll(true);
      }

      setLoadingImages(false); // Set loadingImages to false once all images are fetched
    } catch (err) {
      console.error("Error fetching images:", err);
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="container mx-auto p-4 pb-24">
      {/* Back Button */}
      <button
        onClick={goBack}
        className="flex items-center gap-2 px-3 py-2 text-sm bg-white border rounded shadow hover:bg-gray-200 transition mb-4"
      >
        <span className="text-black">&larr; Back</span>
      </button>

      {/* Event Info and Actions */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold">
            {singleEvent?.eventName || "Event Name"}
          </h2>
          <p className="text-sm text-gray-500">
            {singleEvent?.eventCode || "Event Code"}
          </p>
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

      {/* Masonry Image Grid using CSS columns */}
      <div
        className="masonry-grid"
        style={{
          columnCount: 4,
          columnGap: "1rem",
        }}
      >
        {/* Display skeleton loader if images are loading */}
        {loadingImages
          ? [...Array(10)].map((_, index) => (
              <div
                key={index}
                className="masonry-item break-inside-avoid rounded-lg overflow-hidden bg-gray-100"
                style={{ marginBottom: "1rem" }}
              >
                {/* Skeleton Loader using Tailwind CSS */}
                <div className="w-full h-48 bg-gray-300 animate-pulse rounded-lg"></div>
              </div>
            ))
          : // Display images once loading is finished
            [...images].reverse().map((image, index) => (
              <div
                key={index}
                className="masonry-item break-inside-avoid rounded-lg overflow-hidden bg-gray-100"
                style={{ marginBottom: "1rem" }}
              >
                <img
                  src={image}
                  alt={`Image ${index}`}
                  loading="lazy"
                  className="w-full h-auto object-cover transition-opacity duration-500 ease-in-out opacity-0 blur-sm"
                  onLoad={(e) =>
                    e.currentTarget.classList.remove("opacity-0", "blur-sm")
                  }
                />
              </div>
            ))}
      </div>

      {/* No Images Available Message */}
      {loadedAll && images.length === 0 && (
        <p className="text-center text-gray-500">
          No images available for this event.
        </p>
      )}
    </div>
  );
};

export default ClientPhotosView;
