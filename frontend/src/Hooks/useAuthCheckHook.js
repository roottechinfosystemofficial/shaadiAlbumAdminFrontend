import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import apiRequest from "../utils/apiRequest";
import { USER_API_END_POINT } from "../constant";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../utils/logoutUser";
import Cookies from "js-cookie";
import toast from "../utils/toast.js";
import {
  setAccessToken,
  setAuthUser,
  setRefreshToken,
} from "../Redux/Slices/UserSlice.jsx";
import { setCurrentEvent } from "../Redux/Slices/EventSlice.jsx";

export const useAuthCheck = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { accessToken,authUser } = useSelector((state) => state.user);
  console.log("authUser",authUser)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const endpoint = `${USER_API_END_POINT}/checkAuth`;
        const res = await apiRequest(
          "GET",
          endpoint,
          {},
          accessToken,
          dispatch
        );
        dispatch(setAuthUser(res.data));
      } catch (err) {
        console.error("Auth check failed:", err);

        if (err?.response?.status === 401 && err?.response?.data?.logout) {
          await logoutUser({ accessToken, dispatch, navigate });
        }
        if(err?.response?.data?.error==='User not found'){
           Cookies.remove("accessToken");
            Cookies.remove("refreshToken");
          
            // Clear redux state
            dispatch(setAuthUser(null));
            dispatch(setAccessToken(null));
            dispatch(setRefreshToken(null));
            dispatch(setCurrentEvent(null));
          
            // Redirect to login page
            navigate("/signup");


        }
      }
    };

    if (accessToken) {
      checkAuth(); 
    }
  }, [accessToken, dispatch, navigate]);
};
