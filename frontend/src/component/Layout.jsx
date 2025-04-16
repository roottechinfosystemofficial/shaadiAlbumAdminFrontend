import React, { useEffect } from "react";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  setAccessToken,
  setAuthUser,
  setRefreshToken,
} from "../Redux/Slices/UserSlice";
import { USER_API_END_POINT } from "../constant";
import Cookies from "js-cookie";
import apiRequest from "../utils/apiRequest";

const Layout = () => {
  const dispatch = useDispatch();
  const { authUser, refreshToken } = useSelector((state) => state.user);

  useEffect(() => {
    const getCookies = () => {
      const accessToken = Cookies.get("accessToken");
      const refreshToken = Cookies.get("refreshToken");

      if (accessToken) {
        dispatch(setAccessToken(accessToken));
      }
      if (refreshToken) {
        dispatch(setRefreshToken(refreshToken));
      }
    };

    getCookies();
  }, [dispatch]); // This will only run once after the first render

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const endpoint = `${USER_API_END_POINT}/checkAuth`;
        const res = await apiRequest("GET", endpoint, {}, refreshToken);
        // const res = await axios.get(endpoint, {
        //   withCredentials: true,
        // });
        dispatch(setAuthUser(res.data));
      } catch (err) {
        console.error("Auth check failed:", err);
      }
    };

    if (!authUser) {
      checkAuth();
    }
  }, [authUser, dispatch, refreshToken]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="relative flex-grow min-h-[567px]">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
