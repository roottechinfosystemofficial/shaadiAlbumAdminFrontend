import React, { useEffect, useState } from "react";
import Flipbookfun from "./Flipbookfun";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { S3_API_END_POINT } from "../../constant";
import apiRequest from "../../utils/apiRequest";

const FlipbookShow = () => {
  const { flipBookId } = useParams();
  const { singleEvent } = useSelector((state) => state.event);
  const { accessToken } = useSelector((state) => state.user);
  const [flipbookImages, setFlipbookImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const fetchFlipbookImages = async () => {
    console.log(singleEvent);
    console.log(flipBookId);

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
      console.log(res);

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

  return (
    <div>
      {loading ? (
        <p>Loading flipbook...</p>
      ) : flipbookImages.length > 0 ? (
        <Flipbookfun images={flipbookImages} />
      ) : (
        <p>No flipbook images found.</p>
      )}
    </div>
  );
};

export default FlipbookShow;
