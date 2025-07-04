import React, { useEffect, useState } from "react";

import BusinessSetting from "../component/DashboardComponent/BusinessSetting";
import DirectLinkCard from "../component/DashboardComponent/DirectLinkCard";
import Dashdata from "../component/DashboardComponent/Dashdata";
import DashFooterBoxes from "../component/DashboardComponent/DashFooterBoxes";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { setAccessToken, setRefreshToken } from "../Redux/Slices/UserSlice";
import SubscriptionPlans from "../component/SubSriptions/SubScriptionPlans";
import { getPlanSubscriptionInfo } from "../Redux/thunkfunctions/plansubscription";
import { store } from "../Redux/Store";
import PlanExpiredPopup from "../component/ClientSideComponent/Popups/PlanExpiredModal";
import { useNavigate } from "react-router-dom";
import SubscriptionDeactivatedModal from "../component/ClientSideComponent/Popups/PlanStatsShowModal";
const Dashboard = () => {
  const dispatch = useDispatch();
  const subscriptionState = useSelector((state) => state.subscription.subscriptionState)
  const { accessToken, authUser } = useSelector((state) => state.user);
  const navigate = useNavigate()

  const [expirePlanOpen, setIsPlanExpired] = useState(false)

  
  console.log(subscriptionState.planExpired,subscriptionState.subscriptions)
    const isExpired = subscriptionState.planExpired === true && !subscriptionState.subscriptions;

  const togglePopup = () => {
  console.log("planExpired:", subscriptionState.planExpired);
  console.log("subscriptions:", subscriptionState.subscriptions);

  console.log("isExpired:", isExpired);

  setIsPlanExpired(isExpired);
};


  const onDismiss = () => {
    setIsPlanExpired(false)
  }

  const onUpgrade = () => {
    setIsPlanExpired(false)
    navigate('/subscription-plan')
  }



  useEffect(() => {
    const getCookies = () => {
      const accessToken = Cookies.get("accessToken");
      const refreshToken = Cookies.get("refreshToken");

      if (accessToken) dispatch(setAccessToken(accessToken));
      if (refreshToken) dispatch(setRefreshToken(refreshToken));
    };

    getCookies();
    togglePopup()
  }, []);



  return (
    <div className="flex flex-col gap-[50px] justify-evenly bg-check">
      <Dashdata />
      <BusinessSetting />
      {/* {
        subscriptionState.subscriptions==null &&

      
      (<SubscriptionPlans />)} */}

      <DirectLinkCard />
      <DashFooterBoxes />
      {/* <PlanExpiredPopup onUpgrade={onUpgrade} isOpen={isExpired} />
      <SubscriptionDeactivatedModal isOpen={!subscriptionState.isActive}/> */}
    </div>
  );
};

export default Dashboard;
