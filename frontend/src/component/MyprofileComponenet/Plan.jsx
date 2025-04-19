import React from "react";
import logo from "../../assets/logo_1.png";

const Plan = () => {
  return (
    <div className="px-6 py-2  rounded-lg max-w-6xl mx-auto bg-white">
      {/* Heading */}
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Your Plan</h1>

      {/* Plan Card */}
      <div className=" rounded-lg p-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-2">
          {/* Left - Image and Name */}
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 bg-white rounded-full flex items-center justify-center shadow overflow-hidden">
              <img
                src={logo}
                alt="Plan Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="text-gray-800 text-lg font-medium leading-tight">
              Shaadi Album <br />
              <span className="text-sm font-normal text-gray-500">Free</span>
            </div>
          </div>

          {/* Middle - Storage Info */}
          <div className="flex flex-col w-full md:w-[40%]">
            <div className="flex justify-between text-sm mb-1">
              <span>Images</span>
              <span className="text-slate-dark">2.46 MB / 10.00 GB</span>
            </div>
            <div className="w-full h-2 bg-slate-dark rounded-md overflow-hidden">
              <div className="w-[20%] h-full bg-primary" />
            </div>
          </div>

          {/* Right - Button */}
          <div className="w-full md:w-auto">
            <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition w-full md:w-auto">
              Manage Plan
            </button>
          </div>
        </div>

        {/* Bottom Note */}
        <p className="text-sm text-gray-600 mt-3">
          * After your subscription ends, a 15-day countdown will commence
          before your data is securely removed.
        </p>
      </div>
    </div>
  );
};

export default Plan;
