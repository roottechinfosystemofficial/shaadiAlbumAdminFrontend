import React from "react";
import {
  FaUsers,
  FaCalendarAlt,
  FaImages,
  FaHdd,
  FaClock,
} from "react-icons/fa";

const Dashdata = () => {
  const data = [
    { icon: <FaUsers />, label: "Total Users", value: "120" },
    { icon: <FaCalendarAlt />, label: "Total Events", value: "45" },
    { icon: <FaImages />, label: "Total Media", value: "500 GB" },
    { icon: <FaHdd />, label: "Storage", value: "1.2 TB" },
    { icon: <FaClock />, label: "Expiry On", value: "12/12/2025" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 p-4 mt-5">
      {data.map((item, index) => (
        <div
          key={index}
          className="bg-white border border-slate shadow-md rounded-2xl p-5 transition-all duration-300 hover:shadow-xl hover:border-primary-dark"
        >
          <div className="flex items-center gap-4">
            <div className="text-4xl text-primary-dark bg-slate  p-3 rounded-full">
              {item.icon}
            </div>
            <div className="text-right flex-1">
              <h3 className="text-xl font-semibold text-gray-700">
                {item.label}
              </h3>
              <p className="text-md font-bold text-primary-dark mt-1">
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
