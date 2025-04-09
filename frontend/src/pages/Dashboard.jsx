import React from "react";

import BusinessSetting from "../component/BusinessSetting";
import DirectLinkCard from "../component/DirectLinkCard";
import Dashdata from "../component/Dashdata";
import DashFooterBoxes from "../component/DashFooterBoxes";

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
