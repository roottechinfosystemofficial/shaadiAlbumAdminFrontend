import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setAccessToken, setRefreshToken } from "../Redux/Slices/UserSlice";
import Cookies from "js-cookie";
import { useAuthCheck } from "../Hooks/useAuthCheckHook";
import { useGetSingleFlipBook } from "../Hooks/useGetSingleFlipBook";

const MainLayout = () => {
  const dispatch = useDispatch();
  const { flipBookId } = useSelector((state) => state.event);
  const { refetchFlipBook } = useGetSingleFlipBook(flipBookId);
  useEffect(() => {
    if (flipBookId) {
      refetchFlipBook();
    }
  }, [flipBookId]);
  useEffect(() => {
    const getCookies = () => {
      const accessToken = Cookies.get("accessToken");
      const refreshToken = Cookies.get("refreshToken");

      if (accessToken) dispatch(setAccessToken(accessToken));
      if (refreshToken) dispatch(setRefreshToken(refreshToken));
    };

    getCookies();
  }, [dispatch]);
  // const { refetchFlipBook } = useGetSingleFlipBook(flipBookId);

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
