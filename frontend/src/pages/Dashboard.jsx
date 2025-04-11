import React from "react";

import BusinessSetting from "../component/DashboardComponent/BusinessSetting";
import DirectLinkCard from "../component/DashboardComponent/DirectLinkCard";
import Dashdata from "../component/DashboardComponent/Dashdata";
import DashFooterBoxes from "../component/DashboardComponent/DashFooterBoxes";

const Dashboard = () => {
  return (
    <div className="flex flex-col gap-[50px] justify-evenly bg-[#f6f5f5]">
      <Dashdata />
      <BusinessSetting />
      <DirectLinkCard />
      <DashFooterBoxes />
    </div>
  );
};

export default Dashboard;
