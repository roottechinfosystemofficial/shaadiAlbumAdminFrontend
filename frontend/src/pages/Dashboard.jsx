import React, { useEffect } from "react";

import BusinessSetting from "../component/DashboardComponent/BusinessSetting";
import DirectLinkCard from "../component/DashboardComponent/DirectLinkCard";
import Dashdata from "../component/DashboardComponent/Dashdata";
import DashFooterBoxes from "../component/DashboardComponent/DashFooterBoxes";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { setAccessToken, setRefreshToken } from "../Redux/Slices/UserSlice";

const Dashboard = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const getCookies = () => {
      const accessToken = Cookies.get("accessToken");
      const refreshToken = Cookies.get("refreshToken");

      if (accessToken) dispatch(setAccessToken(accessToken));
      if (refreshToken) dispatch(setRefreshToken(refreshToken));
    };

    getCookies();
  }, []);

  return (
    <div className="flex flex-col gap-[50px] justify-evenly bg-check">
      <Dashdata />
      <BusinessSetting />
      <DirectLinkCard />
      <DashFooterBoxes />
    </div>
  );
};

export default Dashboard;
