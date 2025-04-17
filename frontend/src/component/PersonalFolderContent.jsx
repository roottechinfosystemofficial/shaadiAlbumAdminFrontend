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
    <div className="flex-1 w-full px-4 py-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 border-b-2 border-slate pb-2">
        <div className="text-xl font-semibold flex items-center gap-4">
          <p>Highlights</p>
          <p className="text-slate-dark text-sm">2025-04-03</p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2">
          <button
            className={`px-4 py-2 rounded-md transition ${
              activeTab === "photos"
                ? "bg-primary text-white"
                : "bg-slate hover:bg-primary-dark hover:text-white"
            }`}
            onClick={() => setActiveTab("photos")}
          >
            Photos
          </button>
          <button
            className={`px-4 py-2 rounded-md transition ${
              activeTab === "flipbook"
                ? "bg-primary text-white"
                : "bg-slate hover:bg-primary-dark hover:text-white"
            }`}
            onClick={() => setActiveTab("flipbook")}
          >
            Flipbook
          </button>
          <button
            className={`px-4 py-2 rounded-md transition ${
              activeTab === "favourite"
                ? "bg-primary text-white"
                : "bg-slate hover:bg-primary-dark hover:text-white"
            }`}
            onClick={() => setActiveTab("favourite")}
          >
            Total Favourite - 0
          </button>
        </div>
      </div>

      {/* Render dynamic content */}
      <div>{renderContent()}</div>
    </div>
  );
};

export default PersonalFolderContent;
