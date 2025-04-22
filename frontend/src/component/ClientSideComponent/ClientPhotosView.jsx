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

const ClientPhotosView = ({ singleEvent }) => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [loadedAll, setLoadedAll] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!eventId) return;
    setImages([]);
    setLoadedAll(false);
    setPage(1);
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
          params: { eventId: eventId, page, limit: 30 },
        }
      );

      const allImages = data.images || [];
      setImages((prevImages) => [...prevImages, ...allImages]);

      if (allImages.length < 30) {
        setLoadedAll(true);
      }
    } catch (err) {
      console.error("Error fetching images:", err);
    }
  };

  const handleScroll = (e) => {
    const bottom =
      e.target.scrollHeight === e.target.scrollTop + e.target.clientHeight;
    if (bottom && !loadedAll) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div
      className="container mx-auto p-4 h-[90vh] overflow-y-auto overflow-x-hidden"
      onScroll={handleScroll}
    >
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

      {/* Image Gallery */}
      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
        {images.map((image, index) => (
          <div
            key={index}
            className="mb-4 break-inside-avoid rounded-lg overflow-hidden bg-gray-100 min-h-[200px]"
          >
            <img
              src={image}
              alt={`Image ${index}`}
              className="w-full h-auto transition-opacity duration-500 ease-in-out opacity-0 blur-sm"
              loading="lazy"
              onLoad={(e) =>
                e.currentTarget.classList.remove("opacity-0", "blur-sm")
              }
            />
          </div>
        ))}
      </div>

      {!loadedAll && (
        <div className="text-center py-4">
          <span className="inline-block w-6 h-6 border-4 border-t-transparent border-gray-400 rounded-full animate-spin" />
        </div>
      )}

      {loadedAll && images.length === 0 && (
        <p className="text-center text-gray-500">
          No images available for this event.
        </p>
      )}
    </div>
  );
};

export default ClientPhotosView;
