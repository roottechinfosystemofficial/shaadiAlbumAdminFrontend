import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setAccessToken, setRefreshToken } from "../Redux/Slices/UserSlice";
import Cookies from "js-cookie";
import { useAuthCheck } from "../Hooks/useAuthCheckHook";

const MainLayout = () => {
  const dispatch = useDispatch();
  console.log("mainlayout out");

  useEffect(() => {
    console.log("mainlayout out");
    const getCookies = () => {
      const accessToken = Cookies.get("accessToken");
      const refreshToken = Cookies.get("refreshToken");

      if (accessToken) dispatch(setAccessToken(accessToken));
      if (refreshToken) dispatch(setRefreshToken(refreshToken));
    };

    getCookies();
  }, []);

  useAuthCheck();

  return (
    <div className="flex flex-col min-h-screen">
      <main className="relative flex-grow min-h-[567px]">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
