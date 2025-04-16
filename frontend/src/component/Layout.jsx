import React, { useEffect } from "react";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setAuthUser } from "../Redux/Slices/UserSlice";
import { USER_API_END_POINT } from "../constant";

const Layout = () => {
  const dispatch = useDispatch();
  const { authUser } = useSelector((state) => state.user);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const endpoint = `${USER_API_END_POINT}/checkAuth`;
        const res = await axios.get(endpoint, {
          withCredentials: true,
        });
        dispatch(setAuthUser(res.data));
      } catch (err) {
        console.error("Auth check failed:", err);
      }
    };

    if (!authUser) {
      checkAuth();
    }
  }, [authUser, dispatch]);

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
