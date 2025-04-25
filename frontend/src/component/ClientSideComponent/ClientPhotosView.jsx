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
  const [fetchedImages, setFetchedImages] = useState([]);
  const [nextToken, setNextToken] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showImages, setShowImages] = useState(false);

  const goBack = () => navigate(-1);

  const fetchImages = async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);

    try {
      const { data } = await axios.get(
        "http://localhost:5000/api/v1/list-images",
        {
          params: {
            eventId,
            continuationToken: nextToken,
          },
        }
      );

      setFetchedImages((prev) => [...prev, ...data.images]);
      setNextToken(data.nextToken);
      setHasMore(!!data.nextToken);

      // Simulate 3s skeleton delay
      setTimeout(() => {
        setIsLoading(false);
        setShowImages(true);
      }, 3000);
    } catch (err) {
      console.error("Error fetching images:", err);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setFetchedImages([]);
    setNextToken(null);
    setHasMore(true);
    setShowImages(false);
    fetchImages();
  }, [eventId]);

  return (
    <div className="container mx-auto p-4 pb-24 relative">
      <button
        onClick={goBack}
        className="flex items-center gap-2 px-3 py-2 text-sm bg-white border rounded shadow hover:bg-gray-200 transition mb-4"
      >
        <span className="text-black">&larr; Back</span>
      </button>

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

      {/* Skeleton loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-10">
          <div className="text-white text-xl">
            Loading images... Please wait.
          </div>
        </div>
      )}

      {/* Image Masonry or Skeletons */}
      <div
        className={`columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 mt-6 ${
          isLoading ? "blur-3xl" : ""
        }`}
      >
        {!showImages
          ? Array.from({ length: 10 }).map((_, index) => (
              <div
                key={index}
                className="mb-4 w-full h-64 bg-gray-300 animate-pulse rounded shadow"
              />
            ))
          : fetchedImages.map((image, index) => (
              <img
                key={index}
                src={image}
                className="mb-4 object-cover w-full rounded shadow"
                alt={`Event Image ${index + 1}`}
              />
            ))}
      </div>

      {/* Load More Button */}
      {hasMore && !isLoading && showImages && (
        <div className="mt-8 text-center">
          <button
            onClick={fetchImages}
            className="px-6 py-3 bg-primary text-white rounded-lg shadow hover:bg-primary-dark transition"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default ClientPhotosView;
