import React, { useState } from "react";

// Panels
const VideosPanel = () => (
  <>
    <div className="flex justify-end items-center gap-2 mb-6">
      <button className="bg-gray-200 px-4 py-2 rounded-md">Add Video</button>
      <select className="bg-gray-200 px-4 py-2 rounded-md">
        <option>Sort</option>
      </select>
    </div>
    <p className="text-center text-gray-500 mt-10">No Videos Found!</p>
  </>
);

const PhotosPanel = () => (
  <>
    <div className="flex justify-end items-center gap-2 mb-6">
      <button className="bg-gray-200 px-4 py-2 rounded-md">Add Photo</button>
      <select className="bg-gray-200 px-4 py-2 rounded-md">
        <option>Sort</option>
      </select>
    </div>
    <p className="text-center text-gray-500 mt-10">No Photos Found!</p>
  </>
);

const FlipbookPanel = () => (
  <p className="text-center text-gray-500 mt-10">No Flipbook Found!</p>
);

const FavouritePanel = () => (
  <p className="text-center text-gray-500 mt-10">No Favourite Found!</p>
);

const PersonalFolderContent = () => {
  const [activeTab, setActiveTab] = useState("photos");
  const renderContent = () => {
    switch (activeTab) {
      case "videos":
        return <VideosPanel />;
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
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 border-b-2 border-gray-500 pb-2">
        <div className="text-xl font-semibold flex items-center gap-4">
          <p>Highlights</p>
          <p className="text-gray-500 text-sm">2025-04-03</p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2">
          <button
            className={`px-4 py-2 rounded-md ${
              activeTab === "videos" ? "bg-teal-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setActiveTab("videos")}
          >
            Videos
          </button>
          <button
            className={`px-4 py-2 rounded-md ${
              activeTab === "photos" ? "bg-teal-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setActiveTab("photos")}
          >
            Photos
          </button>
          <button
            className={`px-4 py-2 rounded-md ${
              activeTab === "flipbook"
                ? "bg-teal-500 text-white"
                : "bg-gray-200"
            }`}
            onClick={() => setActiveTab("flipbook")}
          >
            Flipbook
          </button>
          <button
            className={`px-4 py-2 rounded-md ${
              activeTab === "favourite"
                ? "bg-teal-500 text-white"
                : "bg-gray-200"
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
