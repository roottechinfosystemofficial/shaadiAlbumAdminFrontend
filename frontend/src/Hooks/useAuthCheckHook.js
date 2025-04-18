import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import apiRequest from "../utils/apiRequest";
import { USER_API_END_POINT } from "../constant";
import { setAuthUser } from "../Redux/Slices/UserSlice";

export const useAuthCheck = () => {
  const dispatch = useDispatch();
  const { authUser, accessToken } = useSelector((state) => state.user);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("authUser", authUser);
        console.log("access", accessToken);

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
      }
    };

    if (!authUser && accessToken) {
      checkAuth();
    }
  }, [accessToken, authUser, dispatch]);
};
