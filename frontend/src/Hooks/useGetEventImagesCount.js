import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import apiRequest from "../utils/apiRequest";
import { editEvent } from "../utils/editEvents.util";
import { updateEventImageCount } from "../Redux/Slices/EventSlice";
import { S3_API_END_POINT } from "../constant";

export const useGetEventImagesCount = (eventId) => {
  const dispatch = useDispatch();
  const { accessToken } = useSelector((state) => state.user);

  const getEventImagesCount = async () => {
    try {
      const endpoint = `${S3_API_END_POINT}/getEventImageCount?eventId=${eventId}`;
      const res = await apiRequest("GET", endpoint, {}, accessToken, dispatch);

      if (res?.status === 200) {
        const count = res.data.imageCount;

        // ✅ Update Redux
        dispatch(updateEventImageCount(count));

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

  // ✅ Return the manual refresh function
  return { refetchImageCount: getEventImagesCount };
};
