import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import apiRequest from "../utils/apiRequest";
import { USER_API_END_POINT } from "../constant";
import { setAuthUser } from "../Redux/Slices/UserSlice";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../utils/logoutUser";

export const useAuthCheck = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { accessToken } = useSelector((state) => state.user);

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
      }
    };

    if (accessToken) {
      checkAuth(); 
    }
  }, [accessToken, dispatch, navigate]);
};
