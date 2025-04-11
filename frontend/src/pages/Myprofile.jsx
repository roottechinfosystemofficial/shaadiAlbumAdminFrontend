import React, { useState } from "react";
import Domain from "../MyprofileComponenet/Domain";
import Business from "../MyprofileComponenet/Bussiness";
import Social from "../MyprofileComponenet/Social";
import Plan from "../MyprofileComponenet/Plan";
import Profile from "../MyprofileComponenet/Profile";

const MyProfile = () => {
  const [activeSection, setActiveSection] = useState("domain"); // Auto open "Domain"

  const handleBack = () => {
    window.history.back();
  };

  const buttons = [
    { label: "Myprofile", key: "profile" },
    { label: "Domain", key: "domain" },
    { label: "Business Details", key: "business" },
    { label: "Social Links", key: "social" },
    { label: "Your Plan", key: "plan" },
  ];

  return (
    <div className="p-4 md:p-6 space-y-6 md:space-y-8 flex flex-col min-h-screen">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 border-b-2 border-indigo-50 pb-4">
        <button
          onClick={handleBack}
          className="w-fit text-primary hover:bg-primary-dark hover:text-white px-4 py-2 rounded shadow-sm transition"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-bold text-primary">My Profile</h1>
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-wrap justify-center sm:justify-start gap-3 border-b-2 border-indigo-50 pb-5">
        {buttons.map((btn) => {
          const isActive = activeSection === btn.key;
          return (
            <button
              key={btn.key}
              onClick={() => setActiveSection(btn.key)}
              className={`w-full sm:w-[135px] text-center py-2 rounded-lg font-medium transition ${
                isActive
                  ? "bg-primary text-slate"
                  : "bg-slate text-primary hover:bg-primary hover:text-slate"
              }`}
            >
              {btn.label}
            </button>
          );
        })}
      </div>

      {/* Dynamic Section Content */}
      <div className="w-full">
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
