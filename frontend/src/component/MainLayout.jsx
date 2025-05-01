import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setAccessToken, setRefreshToken } from "../Redux/Slices/UserSlice";
import Cookies from "js-cookie";
import { useAuthCheck } from "../Hooks/useAuthCheckHook";
import { useGetSingleFlipBook } from "../Hooks/useGetSingleFlipBook";
import { useGetSingleEvent } from "../Hooks/useGetSingleEvent";

const MainLayout = () => {
  const dispatch = useDispatch();
  const { currentFlipbookId, currentEventId } = useSelector(
    (state) => state.event
  );
  const { refetchFlipBook } = useGetSingleFlipBook(currentFlipbookId);
  const { refetchEvent } = useGetSingleEvent(currentEventId);

  useEffect(() => {
    if (currentFlipbookId) {
      refetchFlipBook();
    }
  }, [currentFlipbookId]);

  useEffect(() => {
    if (currentEventId) {
      refetchEvent();
    }
  }, [currentEventId]);
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
      <main className="relative flex-grow min-h-[567px]">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
