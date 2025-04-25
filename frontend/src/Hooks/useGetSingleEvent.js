import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import apiRequest from "../utils/apiRequest";
import { EVENT_API_END_POINT } from "../constant";
import {
  setSelectedSubEvent,
  setSingleEvent,
} from "../Redux/Slices/EventSlice";

export const useGetSingleEvent = (eventId) => {
  const dispatch = useDispatch();
  const { accessToken } = useSelector((state) => state.user);

  const fetchEvent = useCallback(async () => {
    try {
      const endpoint = `${EVENT_API_END_POINT}/getEventById/${eventId}`;
      const res = await apiRequest("GET", endpoint, {}, accessToken, dispatch);

      if (res.status === 200) {
        const event = res.data.data;
        dispatch(setSingleEvent(event));

        // ✅ Select the first subevent by default (if available)
        if (event?.subevents?.length > 0) {
          dispatch(setSelectedSubEvent(event.subevents[0]));
        }
      }
    } catch (err) {
      console.error("🔴 Error fetching single event:", err);
    }
  }, [eventId, accessToken, dispatch]);

  useEffect(() => {
    if (eventId) {
      fetchEvent();
    }
  }, [fetchEvent]);

  return { refetchEvent: fetchEvent };
};
