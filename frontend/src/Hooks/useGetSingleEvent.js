import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import apiRequest from "../utils/apiRequest";
import { EVENT_API_END_POINT } from "../constant";
import { setSingleEvent } from "../Redux/Slices/EventSlice";

export const useGetSingleEvent = (eventId) => {
  const dispatch = useDispatch();
  const { accessToken } = useSelector((state) => state.user);

  const fetchEvent = useCallback(async () => {
    try {
      const endpoint = `${EVENT_API_END_POINT}/getEventById/${eventId}`;
      const res = await apiRequest("GET", endpoint, {}, accessToken, dispatch);
      console.log(res);

      if (res.status === 200) {
        dispatch(setSingleEvent(res.data.data));
      }
    } catch (err) {
      console.error("Fetching single event failed:", err);
    }
  }, [eventId, accessToken, dispatch]);

  useEffect(() => {
    if (eventId) {
      fetchEvent();
    }
  }, [fetchEvent]);

  return { refetchEvent: fetchEvent };
};
