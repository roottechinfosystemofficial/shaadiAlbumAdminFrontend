import React, { useState, useEffect, useRef } from "react";
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
  const observer = useRef();

  const lastImageRef = useRef();

  const goBack = () => {
    navigate(-1);
  };

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
    } catch (err) {
      console.error("Error fetching images:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setFetchedImages([]);
    setNextToken(null);
    setHasMore(true);
    fetchImages();
  }, [eventId]);

  const lastImageElementRef = (node) => {
    if (isLoading) return;

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        fetchImages();
      }
    });

    if (node) observer.current.observe(node);
  };

  return (
    <div className="container mx-auto p-4 pb-24">
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

      <div className="flex flex-wrap gap-5 mx-auto">
        {fetchedImages.map((image, index) => {
          const isLast = index === fetchedImages.length - 1;
          return (
            <img
              ref={isLast ? lastImageElementRef : null}
              key={index}
              src={image}
              width={355}
              className="object-cover rounded shadow"
              alt={`Event Image ${index + 1}`}
            />
          );
        })}
      </div>

      {isLoading && (
        <div className="text-center mt-4 text-sm text-gray-500">
          Loading more images...
        </div>
      )}
    </div>
  );
};

export default ClientPhotosView;
