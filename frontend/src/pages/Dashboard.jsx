import React from "react";


import BusinessSetting from "../component/BusinessSetting";
import DirectLinkCard from "../component/DirectLinkCard";
import Dashdata from "../component/Dashdata";

const Dashboard = () => {
  return (
    <>
      <Dashdata />
      <BusinessSetting />
      <DirectLinkCard />
    </>
  );
};

export default Dashboard;
