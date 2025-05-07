import React, { useEffect, useState } from "react";
import Flipbookfun from "./Flipbookfun";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { S3_API_END_POINT } from "../../constant";
import apiRequest from "../../utils/apiRequest";
import { useGetSingleFlipBook } from "../../Hooks/useGetSingleFlipBook";

const FlipbookShow = () => {
  const { flipBookId, eventId } = useParams();
  const { currentFlipbook } = useSelector((state) => state.event);
  const { accessToken } = useSelector((state) => state.user);
  const [flipbookImages, setFlipbookImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useGetSingleFlipBook(flipBookId);
  const fetchFlipbookImages = async () => {
    if (!eventId || !flipBookId) return;

    try {
      const res = await apiRequest(
        "POST",
        `${S3_API_END_POINT}/list-flipBookimages`,
        {
          eventId,
          flipbookId: flipBookId,
          usageType: "flipbook",
        },
        accessToken,
        dispatch
      );
      console.log(res.data.images);

      if (res.status === 200) {
        setFlipbookImages(res.data.images || []);
      }
    } catch (err) {
      console.error("Image load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlipbookImages();
  }, [eventId, flipBookId]);

  const frontCover =
    currentFlipbook?.flipbookImages?.frontCoverImageIndex ?? null;
  const backCover =
    currentFlipbook?.flipbookImages?.backCoverImageIndex ?? null;

  const handleNavigateBack = () => {
    navigate(`/personalfolder/${eventId || 1}`);
  };

  const isDataMissing =
    !flipbookImages.length || frontCover === null || backCover === null;

  return (
    <div className="">
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white space-y-6">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin" />
          <p className="text-2xl font-semibold animate-pulse tracking-wide">
            Loading your flipbook...
          </p>
          <p className="text-sm text-gray-400">
            This may take a few seconds ⏳
          </p>
        </div>
      ) : isDataMissing ? (
        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold text-gray-700">
            Flipbook content is incomplete or unavailable.
          </h2>
          <p className="text-gray-500">
            Please ensure images, front cover, and back cover are configured.
          </p>
          <button
            onClick={handleNavigateBack}
            className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Go to Personal Folder
          </button>
        </div>
      ) : (
        <Flipbookfun
          images={flipbookImages}
          frontCover={frontCover}
          backCover={backCover}
        />
      )}
    </div>
  );
};

export default FlipbookShow;
