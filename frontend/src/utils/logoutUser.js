import { USER_API_END_POINT } from "../constant";
import apiRequest from "./apiRequest";
import Cookies from "js-cookie";
import toast from "../utils/toast.js";
import {
  setAccessToken,
  setAuthUser,
  setRefreshToken,
} from "../Redux/Slices/UserSlice.jsx";
import { setCurrentEvent } from "../Redux/Slices/EventSlice.jsx";

export const logoutUser = async ({ accessToken, dispatch, navigate }) => {
  try {
    // If access token is expired or not found, log out the user directly
    if (!accessToken) {
      console.log("Access token missing or expired, logging out directly");
      handleFrontendLogout(dispatch, navigate);
      return;
    }

    // Call backend logout if the access token is valid
    const endpoint = `${USER_API_END_POINT}/logout`;
    const res = await apiRequest("POST", endpoint, {}, accessToken, dispatch);

    if (res.status === 200) {
      handleFrontendLogout(dispatch, navigate);
    }
  } catch (error) {
    console.error("Logout failed:", error.message);
    // Handle frontend logout even if the backend call fails
    handleFrontendLogout(dispatch, navigate);
    toast.error(
      "Unable to logout. Please check your connection and try again."
    );
  }
};

// Helper function to clear everything locally
const handleFrontendLogout = (dispatch, navigate) => {
  // Clear cookies
  Cookies.remove("accessToken");
  Cookies.remove("refreshToken");

  // Clear redux state
  dispatch(setAuthUser(null));
  dispatch(setAccessToken(null));
  dispatch(setRefreshToken(null));
  dispatch(setCurrentEvent(null));

  // Redirect to login page
  navigate("/login");
};
