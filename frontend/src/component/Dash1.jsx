import React from "react";
import {
  FaUsers,
  FaCalendarAlt,
  FaImages,
  FaHdd,
  FaClock,
} from "react-icons/fa";
const Dash1 = () => {
  return (
    <div className=" bg-white grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 p-4 shadow-[0_-5px_10px_rgba(0,0,0,0.1),0_5px_10px_rgba(0,0,0,0.1)] mt-5">
      <div className="bg-blue-500 text-white p-6 rounded-lg shadow-md flex items-center">
        <FaUsers className="text-4xl mr-4" />
        <div>
          <h3 className="text-xl font-semibold">Total Users</h3>
          <p className="text-2xl">120</p>
        </div>
      </div>
      <div className="bg-green-500 text-white p-6 rounded-lg shadow-md flex items-center">
        <FaCalendarAlt className="text-4xl mr-4" />
        <div>
          <h3 className="text-xl font-semibold">Total Events</h3>
          <p className="text-2xl">45</p>
        </div>
      </div>
      <div className="bg-red-500 text-white p-6 rounded-lg shadow-md flex items-center">
        <FaImages className="text-4xl mr-4" />
        <div>
          <h3 className="text-xl font-semibold">Total Media</h3>
          <p className="text-2xl">500 GB</p>
        </div>
      </div>
      <div className="bg-yellow-500 text-white p-6 rounded-lg shadow-md flex items-center">
        <FaHdd className="text-4xl mr-4" />
        <div>
          <h3 className="text-xl font-semibold">Storage</h3>
          <p className="text-2xl">1.2 TB</p>
        </div>
      </div>
      <div className="bg-purple-500 text-white p-6 rounded-lg shadow-md flex items-center">
        <FaClock className="text-4xl mr-4" />
        <div>
          <h3 className="text-xl font-semibold">Expiry On</h3>
          <p className="text-2xl">12/12/2025</p>
        </div>
      </div>
    </div>
  );
};

export default Dash1;
