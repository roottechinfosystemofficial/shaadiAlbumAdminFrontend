import React, { useEffect, useState } from "react";
import {
  FaUsers,
  FaCalendarAlt,
  FaImages,
  FaHdd,
  FaClock,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import toast from "../../utils/toast";
import { USER_API_END_POINT } from "../../constant";
import apiRequest from "../../utils/apiRequest";

const Dashdata = () => {
  const { accessToken } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    totalEvents: 0,
    userImageCount: 0,
  });

  const getDashboardData = async () => {
    try {
      const endpoint = `${USER_API_END_POINT}/dashboard`;
      const res = await apiRequest("GET", endpoint, {}, accessToken, dispatch);
      if (res?.status === 200) {
        setDashboardData(res?.data);
      }
    } catch (error) {
      toast.error("Failed to load dashboard");
    }
  };

  useEffect(() => {
    if (accessToken) {
      getDashboardData();
    }
  }, [accessToken]);

  const data = [
    {
      icon: <FaUsers />,
      label: "Total Users",
      value: dashboardData.totalUsers,
    },
    {
      icon: <FaCalendarAlt />,
      label: "Total Events",
      value: dashboardData.totalEvents,
    },
    {
      icon: <FaImages />,
      label: "Total Media",
      value: `${dashboardData.userImageCount}`,
    },
    // { icon: <FaHdd />, label: "Storage", value: "400GB" },
    { icon: <FaClock />, label: "Expiry On", value: "Coming Soon" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-6 py-4 mt-5">
      {data.map((item, index) => (
        <div
          key={index}
          className="bg-white border border-slate shadow-md rounded-2xl px-5 py-3 min-h-[150px] transition-all duration-300 hover:shadow-xl hover:border-primary-dark"
        >
          <div className="flex items-center gap-6 h-full">
            <div className="text-5xl text-primary-dark bg-slate p-4 rounded-full">
              {item.icon}
            </div>
            <div className="text-right flex-1">
              <h3 className="text-2xl font-semibold text-gray-700">
                {item.label}
              </h3>
              <p className="text-xl font-bold text-primary-dark mt-1">
                {item.value}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Dashdata;
