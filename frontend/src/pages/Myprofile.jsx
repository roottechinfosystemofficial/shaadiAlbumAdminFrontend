import React, { useState } from "react";
import Domain from "../component/MyprofileComponenet/Domain";
import Business from "../component/MyprofileComponenet/Bussiness";
import Social from "../component/MyprofileComponenet/Social";
import Profile from "../component/MyprofileComponenet/Profile";
import Plan from "../component/MyprofileComponenet/Plan";

const MyProfile = () => {
  const [activeSection, setActiveSection] = useState("domain");

  const handleBack = () => {
    window.history.back();
  };

  const buttons = [
    { label: "My Profile", key: "profile" },
    { label: "Domain", key: "domain" },
    { label: "Business Details", key: "business" },
    { label: "Social Links", key: "social" },
    { label: "Your Plan", key: "plan" },
  ];

  return (
    <div className="p-4 md:p-6 space-y-6 md:space-y-8 flex flex-col min-h-screen text-gray-800">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 border-b border-slate-dark pb-4">
        <button
          onClick={handleBack}
          className="w-fit text-primary border border-primary px-4 py-2 rounded-lg hover:bg-primary-dark hover:text-white transition"
        >
          ← Back
        </button>
        <h1 className="text-3xl font-bold text-primary">My Profile</h1>
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-wrap justify-center sm:justify-start gap-3 border-b border-slate-dark pb-5">
        {buttons.map((btn) => {
          const isActive = activeSection === btn.key;
          return (
            <button
              key={btn.key}
              onClick={() => setActiveSection(btn.key)}
              className={`w-full sm:w-[140px] text-center py-2 rounded-lg font-semibold transition ${
                isActive
                  ? "bg-primary text-white shadow-md"
                  : "bg-white border border-primary text-primary hover:bg-primary hover:text-white"
              }`}
            >
              {btn.label}
            </button>
          );
        })}
      </div>

      {/* Dynamic Section Content */}
      <div className="w-full rounded-xl shadow bg-white p-4 sm:p-6 border border-slate-dark">
        {activeSection === "domain" && <Domain />}
        {activeSection === "business" && <Business />}
        {activeSection === "social" && <Social />}
        {activeSection === "profile" && <Profile />}
        {activeSection === "plan" && <Plan />}
      </div>
    </div>
  );
};

export default MyProfile;
