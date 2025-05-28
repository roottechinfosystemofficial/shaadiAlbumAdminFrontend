import { EVENT_API_END_POINT } from "../constant";
import apiRequest from "./apiRequest";

export const editEvent = async (eventId, data, dispatch, accessToken) => {
  const endpoint = `${EVENT_API_END_POINT}/editEventById/${eventId}`;

  try {
    const res = await apiRequest("PUT", endpoint, data, accessToken, dispatch);
    console.log(res);

    return res;
  } catch (error) {
    console.error("Update event failed:", error);
    throw error;
  }
};

export const downloadEvent = async (
  eventId,
  payload,
  dispatch,
  accessToken
) => {
  const method = payload ? "POST" : "GET";

  const endpoint = `${EVENT_API_END_POINT}/DownloadEventSetting/${eventId}`;

  try {
    const res = await apiRequest(
      method,
      endpoint,
      payload || {},
      accessToken,
      dispatch
    );
    return res;
  } catch (error) {
    console.error("Update event failed:", error);
    throw error;
  }
};
