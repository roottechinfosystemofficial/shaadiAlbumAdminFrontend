import { EVENT_API_END_POINT } from "../constant";
import apiRequest from "./apiRequest";

export const editEvent = async (eventId, data, dispatch, accessToken) => {
  const endpoint = `${EVENT_API_END_POINT}/editEventById/${eventId}`;

  try {
    const res = await apiRequest("PUT", endpoint, data, accessToken, dispatch);
    return res;
  } catch (error) {
    console.error("Update event failed:", error);
    throw error;
  }
};
