import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import apiRequest from "../../utils/apiRequest";
import { S3_API_END_POINT } from "../../constant";
import { ArrowDownToLineIcon } from "lucide-react";
import SelectedImage from "./SelectedImage";
import LoaderModal from "../LoadingModal";
import { getSettings } from "../../Redux/thunkfunctions/settings";
import toast from "../../utils/toast";
import { setS3Keys } from "../../Redux/Slices/S3Images";

const ClientPhotosView = ({
  image,
  eventId,
  subEventId,
  eventName,
  accessToken,
  authUser,
  s3Keys,
  currentView = "All"
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const settingState = useSelector((state) => state.settings.settingState);

  const [fetchedImages, setFetchedImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [allImages, setAllImages] = useState([]);

  const nextTokenOriginalRef = useRef(null);
  const nextTokenThumbsRef = useRef(null);

  const fetchUserSettings = async () => {
    await dispatch(getSettings({ userId: authUser?._id }));
  };

  useEffect(() => {
    fetchUserSettings();
  }, []);

  const fetchImages = async () => {
    if (!image || !s3Keys?.length) return;

    setIsLoading(true);

    try {
      const res = await apiRequest(
        "POST",
        `${S3_API_END_POINT}/face-recognition/match`,
        {
          eventId,
          subEventId,
          image,
          s3Keys,
          userId: authUser?._id,
          eventName
        },
        accessToken
      );

      if (res?.status === 200) {
        const matches = res.data.matches || [];
        setFetchedImages(matches);
        nextTokenOriginalRef.current = res.data.nextTokenOriginal || null;
        nextTokenThumbsRef.current = res.data.nextTokenThumbs || null;
        setHasMore(!!(res.data.nextTokenOriginal || res.data.nextTokenThumbs));
      }
    } catch (err) {
      console.error("Face match failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [image]);

  const fetchAllImages = async () => {
    try {
      const res = await apiRequest(
        "POST",
        `${S3_API_END_POINT}/list-images`,
        {
          eventId,
          subEventId
        },
        accessToken,
        dispatch
      );
      setAllImages(res.data.images);
      
    } catch (err) {
      toast.error("Unable to fetch Images");
    }
  };

  useEffect(() => {
    fetchAllImages();
  }, []);

  const handleDownload = async (img) => {
    if (!img?.originalUrl) return;

    try {
      const response = await fetch(img.originalUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = img.filename || "image.jpg";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed", err);
    }
  };

  const getWatermarkStyle = () => {
    const positionMap = {
      "top-left": { top: "5%", left: "5%" },
      "top-center": { top: "5%", left: "50%", transform: "translateX(-50%)" },
      "top-right": { top: "5%", right: "5%" },
      "center-left": { top: "50%", left: "5%", transform: "translateY(-50%)" },
      center: { top: "50%", left: "50%", transform: "translate(-50%, -50%)" },
      "center-right": { top: "50%", right: "5%", transform: "translateY(-50%)" },
      "bottom-left": { bottom: "5%", left: "5%" },
      "bottom-center": { bottom: "5%", left: "50%", transform: "translateX(-50%)" },
      "bottom-right": { bottom: "5%", right: "5%" }
    };

    const positionStyles = positionMap[settingState?.position] || {};
    return {
      position: "absolute",
      opacity: settingState?.opacity / 100,
      pointerEvents: "none",
      zIndex: 10,
      ...positionStyles
    };
  };

  return (
    <>
      <div className="container mx-auto p-4 pb-24 relative">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-3 py-2 text-sm bg-white border rounded shadow hover:bg-gray-200 transition mb-4"
        >
          <span className="text-black">&larr; Back</span>
        </button>

        {currentView === "All" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-2 mt-4">
            {allImages.map((img, idx) => (
              <div
                key={idx}
                className="rounded-xl overflow-hidden shadow hover:shadow-xl bg-white cursor-pointer"
                onClick={() => setSelectedImage(img)}
              >
                <div style={{ position: "relative", height: "300px", width: "100%" }}>
                  <img
                    src={img.originalUrl}
                    alt={`Img ${idx + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />

                  {settingState?.waterMarkEnabled && (
                    <>
                      {settingState.watermarkType === "text" &&
                        settingState.watermarkText && (
                          <div
                            style={{
                              ...getWatermarkStyle(),
                              fontSize: `${settingState.fontSize}px`,
                              color: settingState.fontColor,
                              fontFamily: settingState.fontStyle
                            }}
                          >
                            {settingState.watermarkText}
                          </div>
                        )}

                      {settingState.watermarkType === "icon" &&
                        settingState.iconImg && (
                          <img
                            src={settingState.iconImg}
                            alt="Watermark Icon"
                            style={{
                              ...getWatermarkStyle(),
                              width: `${settingState.iconSize}px`,
                              height: `${settingState.iconSize}px`
                            }}
                          />
                        )}
                    </>
                  )}

                  {img.originalUrl && (
                    <button
                      className="absolute bottom-0 right-0 flex items-center gap-2 px-3 py-2 text-sm bg-gray-200 border rounded shadow hover:bg-gray-300"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(img);
                      }}
                      style={{ zIndex: 20 }}
                    >
                      <ArrowDownToLineIcon className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : isLoading && !fetchedImages.length ? (
          <LoaderModal message="Loading Matching Images..." isOpen={isLoading} />
        ) : fetchedImages.length === 0 ? (
          <p className="text-center text-gray-500 mt-12">No matching images found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-2 mt-4">
            {fetchedImages.map((img, idx) => (
              <div
                key={idx}
                className="rounded-xl overflow-hidden shadow hover:shadow-xl bg-white cursor-pointer"
                onClick={() => setSelectedImage(img)}
              >
                <div style={{ position: "relative", height: "300px", width: "100%" }}>
                  <img
                    src={img.url}
                    alt={`Matched Img ${idx + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />

                  {settingState?.waterMarkEnabled && (
                    <>
                      {settingState.watermarkType === "text" &&
                        settingState.watermarkText && (
                          <div
                            style={{
                              ...getWatermarkStyle(),
                              fontSize: `${settingState.fontSize}px`,
                              color: settingState.fontColor,
                              fontFamily: settingState.fontStyle
                            }}
                          >
                            {settingState.watermarkText}
                          </div>
                        )}

                      {settingState.watermarkType === "icon" &&
                        settingState.iconImg && (
                          <img
                            src={settingState.iconImg}
                            alt="Watermark Icon"
                            style={{
                              ...getWatermarkStyle(),
                              width: `${settingState.iconSize}px`,
                              height: `${settingState.iconSize}px`
                            }}
                          />
                        )}
                    </>
                  )}

                  {img.originalUrl && (
                    <button
                      className="absolute bottom-0 right-0 flex items-center gap-2 px-3 py-2 text-sm bg-gray-200 border rounded shadow hover:bg-gray-300"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(img);
                      }}
                      style={{ zIndex: 20 }}
                    >
                      <ArrowDownToLineIcon className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedImage && (
        <SelectedImage
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
          currentView={currentView}
        />
      )}
    </>
  );
};

export default ClientPhotosView;
