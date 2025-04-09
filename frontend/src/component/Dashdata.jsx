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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 p-4">
      {data.map((item, index) => (
        <div
          key={index}
          className="bg-white  transition duration-300 text-primary rounded-2xl px-3 py-2 shadow-md flex flex-col justify-between"
        >
          <div className="flex items-center justify-between ">
            <div className="text-4xl opacity-80">{item.icon}</div>
            <div className="text-right">
              <h3 className="text-lg font-medium tracking-wide">
                {item.label}
              </h3>
              <p className="text-xl font-semibold mt-1">{item.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Dashdata;
