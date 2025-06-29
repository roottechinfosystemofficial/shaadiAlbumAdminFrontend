// ============================
// ClientPhotosView.jsx
// ============================

import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import apiRequest from "../../utils/apiRequest";
import { S3_API_END_POINT } from "../../constant";
import { ArrowDownToLineIcon } from "lucide-react";
import SelectedImage from "./SelectedImage";
import LoaderModal from "../LoadingModal";

const ClientPhotosView = ({
  image,
  eventId,
  subEventId,
  eventName,
  accessToken,
  authUser,
  s3Keys,
}) => {
  const navigate = useNavigate();

  const [fetchedImages, setFetchedImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const nextTokenOriginalRef = useRef(null);
  const nextTokenThumbsRef = useRef(null);

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
          eventName,
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

  return (
    <>
      <div className="container mx-auto p-4 pb-24 relative">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-3 py-2 text-sm bg-white border rounded shadow hover:bg-gray-200 transition mb-4"
        >
          <span className="text-black">&larr; Back</span>
        </button>

        {isLoading && !fetchedImages.length ? (
          <LoaderModal message="Loading Matching Images..." isOpen={isLoading} />
        ) : fetchedImages.length === 0 ? (
          <p className="text-center text-gray-500 mt-12">
            No matching images found.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-2 mt-4">
            {fetchedImages.map((img, idx) => (
              <div
                key={idx}
                className="rounded-xl overflow-hidden shadow hover:shadow-xl bg-white cursor-pointer"
                onClick={() => setSelectedImage(img)}
              >
                <div className="relative">
                  <img
                    src={img.url}
                    alt={`Matched Img ${idx + 1}`}
                    className="w-full h-[300px] object-contain"
                    loading="lazy"
                  />
                  {img.originalUrl && (
                    <button
                      className="absolute bottom-0 right-0 flex items-center gap-2 px-3 py-2 text-sm bg-gray-200 border rounded shadow hover:bg-gray-300"
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
      </div>

      {selectedImage && (
        <SelectedImage selectedImage={selectedImage} setSelectedImage={setSelectedImage} />
      )}
    </>
  );
};

export default ClientPhotosView;