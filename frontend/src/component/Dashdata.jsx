import React from "react";
import {
  FaUsers,
  FaCalendarAlt,
  FaImages,
  FaHdd,
  FaClock,
} from "react-icons/fa";

const Dashdata = () => {
  return (
    <div className="bg-white grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 p-4 shadow-lg mt-5">
      {[
        { icon: <FaUsers />, label: "Total Users", value: "120" },
        { icon: <FaCalendarAlt />, label: "Total Events", value: "45" },
        { icon: <FaImages />, label: "Total Media", value: "500 GB" },
        { icon: <FaHdd />, label: "Storage", value: "1.2 TB" },
        { icon: <FaClock />, label: "Expiry On", value: "12/12/2025" },
      ].map((item, index) => (
        <div
          key={index}
          className="bg-primary hover:bg-primary-dark transition-colors duration-300 text-white p-6 rounded-lg shadow-md flex items-center"
        >
          <div className="text-4xl mr-4">{item.icon}</div>
          <div>
            <h3 className="text-xl font-semibold">{item.label}</h3>
            <p className="text-2xl">{item.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Dashdata;
