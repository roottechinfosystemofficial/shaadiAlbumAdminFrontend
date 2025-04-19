import React, { useState } from "react";
import FlipbookPanel from "./Personalfoldercomponent/FlipbookPanel";
import PhotosPanel from "./Personalfoldercomponent/PhotosPanel";

const FavouritePanel = () => (
  <p className="text-center text-slate-dark mt-10">No Favourite Found!</p>
);

const PersonalFolderContent = () => {
  const [activeTab, setActiveTab] = useState("photos");

  const renderContent = () => {
    switch (activeTab) {
      case "photos":
        return <PhotosPanel />;
      case "flipbook":
        return <FlipbookPanel />;
      case "favourite":
        return <FavouritePanel />;
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 w-full px-4 sm:px-6 py-6 min-h-screen overflow-hidden">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 border-b-2 border-slate pb-3">
        <div className="text-xl font-semibold flex flex-wrap items-center gap-4">
          <p>Highlights</p>
          <p className="text-slate-dark text-sm">2025-04-03</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto md:overflow-visible whitespace-nowrap scrollbar-hide">
          {["photos", "flipbook", "favourite"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition shrink-0 ${
                activeTab === tab
                  ? "bg-primary text-white"
                  : "bg-slate text-gray-800 hover:bg-primary-dark hover:text-white"
              }`}
            >
              {tab === "photos"
                ? "Photos"
                : tab === "flipbook"
                ? "Flipbook"
                : "Total Favourite - 0"}
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic Content */}
      <div className="w-full">{renderContent()}</div>
    </div>
  );
};

export default PersonalFolderContent;
