import React, { useEffect } from "react";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setAccessToken, setRefreshToken } from "../Redux/Slices/UserSlice";
import Cookies from "js-cookie";
import { useAuthCheck } from "../Hooks/useAuthCheckHook";

const Layout = () => {
  const dispatch = useDispatch();
  const { authUser } = useSelector((state) => state.user);
  console.log(authUser);

  useEffect(() => {
    const getCookies = () => {
      const accessToken = Cookies.get("accessToken");
      const refreshToken = Cookies.get("refreshToken");

      if (accessToken) dispatch(setAccessToken(accessToken));
      if (refreshToken) dispatch(setRefreshToken(refreshToken));
    };

    getCookies();
  }, [dispatch]);
  useAuthCheck();

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
