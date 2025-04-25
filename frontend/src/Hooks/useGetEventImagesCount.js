import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import apiRequest from "../utils/apiRequest";
import { editEvent } from "../utils/editEvents.util";

export const useGetEventImagesCount = (eventId) => {
  const dispatch = useDispatch();
  const { accessToken } = useSelector((state) => state.user);
  const [imageCount, setImageCount] = useState(null);

  const getEventImagesCount = async () => {
    try {
      const endpoint = `http://localhost:5000/api/v1/getEventImageCount?eventId=${eventId}`;
      const res = await apiRequest("GET", endpoint, {}, accessToken, dispatch);

      if (res?.status === 200) {
        const count = res.data.imageCount;
        setImageCount(count);

        // Optional: update backend too
        await editEvent(eventId, { imageCount: count }, dispatch, accessToken);
      }
    } catch (err) {
      console.error("Cannot get or update Image Count:", err);
    }
  };

  useEffect(() => {
    if (eventId) {
      getEventImagesCount();
    }
  }, [eventId]);

  return { imageCount, refetchImageCount: getEventImagesCount };
};
