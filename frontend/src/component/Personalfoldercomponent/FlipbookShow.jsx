import React, { useEffect, useState } from "react";
import Flipbookfun from "./Flipbookfun";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { S3_API_END_POINT } from "../../constant";
import apiRequest from "../../utils/apiRequest";

const FlipbookShow = () => {
  const { flipBookId } = useParams();
  const { singleEvent, selectedFlipBook } = useSelector((state) => state.event);
  const { accessToken } = useSelector((state) => state.user);
  const [flipbookImages, setFlipbookImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const fetchFlipbookImages = async () => {
    if (!singleEvent?._id || !flipBookId) return;

    try {
      const res = await apiRequest(
        "POST",
        `${S3_API_END_POINT}/list-images`,
        {
          eventId: singleEvent._id,
          flipbookId: flipBookId,
          usageType: "flipbook",
        },
        accessToken,
        dispatch
      );
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
  }, [singleEvent?._id, flipBookId]);

  // Extract front and back cover indices from selectedFlipBook
  const frontCover =
    selectedFlipBook?.flipbookImages?.frontCoverImageIndex ?? null;
  const backCover =
    selectedFlipBook?.flipbookImages?.backCoverImageIndex ?? null;

  return (
    <div>
      {loading ? (
        <p>Loading flipbook...</p>
      ) : flipbookImages.length > 0 ? (
        <Flipbookfun
          images={flipbookImages}
          frontCover={frontCover}
          backCover={backCover}
        />
      ) : (
        <p>No flipbook images found.</p>
      )}
    </div>
  );
};

export default FlipbookShow;
