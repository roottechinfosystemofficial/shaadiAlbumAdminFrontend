import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ScanFace,
  Heart,
  Upload,
  ShoppingCart,
  Share2,
  ArrowDownToLineIcon,
} from "lucide-react";
import apiRequest from "../../utils/apiRequest";
import { S3_API_END_POINT } from "../../constant";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentSubEventId } from "../../Redux/Slices/EventSlice";
import { debounce } from "lodash";

const ClientPhotosView = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [fetchedImages, setFetchedImages] = useState([]);
  const [nextToken, setNextToken] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showImages, setShowImages] = useState(false);
  const { accessToken } = useSelector((state) => state.user);
  const { currentEvent } = useSelector((state) => state.event);
  const [activeSubEventId, setActiveSubEventId] = useState(null);
  const dispatch = useDispatch();

  const goBack = () => navigate(-1);

  const handleSubEventClick = (id) => {
    setActiveSubEventId(id);
    dispatch(setCurrentSubEventId(id));
    debouncedFetchImages();
  };

  const fetchImages = async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);

    try {
      const endpoint = `${S3_API_END_POINT}/list-images`;
      const res = await apiRequest(
        "POST",
        endpoint,
        {
          eventId,
          continuationToken: nextToken,
          subEventId: activeSubEventId,
        },
        accessToken,
        dispatch
      );

      if (res.status === 200) {
        const newImages = res.data.images || [];
        setFetchedImages((prev) => [...prev, ...newImages]);
        setNextToken(res.data.nextContinuationToken || null);
        setHasMore(!!res.data.nextContinuationToken);
        setShowImages(true);
      }
    } catch (err) {
      console.error("Error fetching images:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedFetchImages = useMemo(
    () => debounce(fetchImages, 500),
    [activeSubEventId, nextToken]
  );

  useEffect(() => {
    if (currentEvent?.subevents?.length > 0) {
      const firstId = currentEvent.subevents[0]._id;
      setActiveSubEventId(firstId);
      dispatch(setCurrentSubEventId(firstId));
    }
    setFetchedImages([]);
    setNextToken(null);
    setHasMore(true);
    setShowImages(false);
    debouncedFetchImages();
  }, [eventId, currentEvent]);

  useEffect(() => {
    return () => debouncedFetchImages.cancel();
  }, [debouncedFetchImages]);

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
            {currentEvent?.eventName || "Event Name"}
          </h2>
          <p className="text-sm text-gray-500">
            {currentEvent?.eventCode || "Event Code"}
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

      {/* Subevent List */}
      <div className="flex overflow-x-auto pb-6 gap-4">
        {currentEvent?.subevents?.map((subevent, index) => (
          <div
            key={index}
            onClick={() => handleSubEventClick(subevent?._id)}
            className={`flex-shrink-0 w-32 p-2 rounded-md shadow-lg cursor-pointer transition-all duration-200 ${
              activeSubEventId === subevent?._id
                ? "bg-primary text-white"
                : "bg-gray-300 text-black"
            } hover:bg-gray-400`}
          >
            <h3 className="text-sm font-semibold text-center">
              {subevent?.subEventName}
            </h3>
          </div>
        ))}
      </div>

      {/* Image Grid */}
      {showImages ? (
        fetchedImages.length > 0 ? (
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4 px-2 mt-4">
            {fetchedImages.map((img, idx) => (
              <div
                key={idx}
                className="break-inside-avoid rounded-xl overflow-hidden shadow hover:shadow-xl transition-all bg-white"
              >
                <img
                  src={img}
                  alt={`Event Img ${idx + 1}`}
                  className="w-full h-[300px] object-contain"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-8">
            No images found for this sub-event.
          </p>
        )
      ) : (
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4 px-2 mt-4">
          {Array.from({ length: 10 }).map((_, idx) => (
            <div
              key={idx}
              className="h-64 bg-gray-300 rounded-xl animate-pulse shadow break-inside-avoid"
            ></div>
          ))}
        </div>
      )}

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
