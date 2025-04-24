import { useDispatch, useSelector } from "react-redux";
import { EVENT_API_END_POINT } from "../constant";
import apiRequest from "../utils/apiRequest";
import { useEffect } from "react";

export const useGetEventImagesCount = (eventId) => {
  const dispatch = useDispatch();

  const { accessToken } = useSelector((state) => state.user);
  const getEventImagesCount = async () => {
    try {
      const endpoint = `http://localhost:5000/api/v1/getEventImageCount/${eventId}`;
      const res = await apiRequest("GET", endpoint, {}, accessToken, dispatch);
      console.log(res);
    } catch (error) {
      console.error("Cannot get Image Count:", error);
    }
  };

  useEffect(() => {
    getEventImagesCount();
  }, []);
};
