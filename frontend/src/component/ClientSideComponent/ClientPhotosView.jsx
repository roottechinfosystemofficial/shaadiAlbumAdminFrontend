import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentSubEventId } from "../../Redux/Slices/EventSlice";
import apiRequest from "../../utils/apiRequest";
import { S3_API_END_POINT } from "../../constant";
import {
  ScanFace,
  Heart,
  Upload,
  ShoppingCart,
  Share2,
  ArrowDownToLineIcon,
  X,
} from "lucide-react";
import SelectedImage from "./SelectedImage";
import { Loader } from "../Loader";
import LoaderModal from "../LoadingModal";

const ClientPhotosView = ({image}) => {
  console.log("on client photos views")
  const { eventId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [fetchedImages, setFetchedImages] = useState([]);
  const [nextToken, setNextToken] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [activeSubEventId, setActiveSubEventId] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [nextTokenOriginal, setNextTokenOriginal] = useState(null);
  const [nextTokenThumbs, setNextTokenThumbs] = useState(null);

  const nextTokenOriginalRef = useRef(null);
  const nextTokenThumbsRef = useRef(null);

  const { accessToken,authUser } = useSelector((state) => state.user);
  const { currentEvent,currentSubEvent } = useSelector((state) => state.event);
  const s3Images=useSelector(state=>state.s3Images)
  const s3Keys=s3Images.s3Keys?.map((i)=>(`eventimages/${currentEvent?._id}/${currentSubEvent?._id}/Original/${i.filename}`))


  console.log("s3Keys:",currentEvent)

  const isLoadingRef = useRef(false);
  const hasMoreRef = useRef(true);
  const nextTokenRef = useRef(null);

  const goBack = () => navigate(-1);

  const handleSubEventClick = (id) => {
    setActiveSubEventId(id);
    dispatch(setCurrentSubEventId(id));
  };

  const fetchImages = async () => {
    if (s3Keys==[] || !s3Images.image)
      return;

    setIsLoading(true);
    isLoadingRef.current = true;

    try {
      const endpoint = `${S3_API_END_POINT}/face-recognition/match`;

      const continuationTokenOriginal = nextTokenOriginalRef.current || "";
      const continuationTokenThumbs = nextTokenThumbsRef.current || "";

      const res = await apiRequest(
        "POST",
        endpoint,
        {
          eventId,
          subEventId: activeSubEventId,
          image:s3Images.image,
          s3Keys:s3Keys,
          userId:authUser?._id,
          eventName:currentEvent?.eventName

        },
        accessToken,
        dispatch
      );

      if (res.status === 200) {
        const newImages = res.data.matches || [];

        // Append new images
        setFetchedImages((prev) => [...prev, ...newImages]);

        // Handle next tokens separately
        const newTokenOriginal = res.data.nextTokenOriginal || null;
        const newTokenThumbs = res.data.nextTokenThumbs || null;

        if (newTokenOriginal || newTokenThumbs) {
          setNextTokenOriginal(newTokenOriginal);
          setNextTokenThumbs(newTokenThumbs);
          nextTokenOriginalRef.current = newTokenOriginal;
          nextTokenThumbsRef.current = newTokenThumbs;
          setHasMore(true);
          hasMoreRef.current = true;
        } else {
          setHasMore(false);
          hasMoreRef.current = false;
        }
      }
    } catch (err) {
      console.error("Error fetching images:", err);
    } finally {
      setIsLoading(false);
      isLoadingRef.current = false;
    }
  };

  useEffect(() => {
    if (currentEvent?.subevents?.length > 0) {
      const firstId = currentEvent.subevents[0]._id;
      setActiveSubEventId(firstId);
      dispatch(setCurrentSubEventId(firstId));
    }
  }, [eventId, currentEvent, dispatch]);
  useEffect(() => {
    if (activeSubEventId) {
      setFetchedImages([]); // Clear previous
      setNextTokenOriginal(null);
      setNextTokenThumbs(null);
      nextTokenOriginalRef.current = null;
      nextTokenThumbsRef.current = null;
      setHasMore(true);
      hasMoreRef.current = true;
      fetchImages();
    }
  }, [activeSubEventId]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition =
        window.innerHeight + document.documentElement.scrollTop;
      const bottom = document.documentElement.offsetHeight;

      if (scrollPosition >= bottom - 100 && !isLoading && hasMore) {
        fetchImages();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLoading, hasMore]);

  const handleDownload = async (img) => {
    if (!img?.originalUrl) return;

    try {
      const response = await fetch(img.originalUrl, {
        mode: "cors",
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = img.filename || "image.jpg";
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed:", err);
      alert("Failed to download image. CORS or network error.");
    }
  };

  return (
    <>
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
              // ScanFace,
              // Heart,
              // Upload,
              // ShoppingCart,
              // Share2,
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

        {isLoading && !fetchedImages.length ? (
          <LoaderModal message="Loading Matching Images..." isOpen={isLoading}/>
        ) : fetchedImages.length === 0 ? (
          <p className="text-center text-gray-500 mt-12">
            No images found for this sub-event.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-2 mt-4">
            {fetchedImages.map((img, idx) => (
              <div
                key={idx}
                className="break-inside-avoid rounded-xl overflow-hidden shadow hover:shadow-xl transition-all bg-white cursor-pointer"
                onClick={() => setSelectedImage(img)}
              >
                <div className="relative">
                  <img
                    src={img.url}
                    alt={`Event Img ${idx + 1}`}
                    className="w-full h-[300px] object-contain z-0"
                    loading="lazy"
                  />
                  {currentEvent?.isImageDownloadEnabled && (
                    <button
                      className="absolute z-50 bottom-0 right-0 flex items-center gap-2 px-3 py-2 text-sm bg-gray-200 border rounded shadow hover:bg-gray-200 transition"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(img);
                      }}
                    >
                      <ArrowDownToLineIcon className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Image Modal */}
      </div>
      {selectedImage && (
        <SelectedImage
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
        />
      )}
    </>
  );
};

export default ClientPhotosView;
