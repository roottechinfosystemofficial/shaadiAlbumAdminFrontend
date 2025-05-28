import React from "react";
import FlipbookPanel from "./Personalfoldercomponent/FlipbookPanel";
import PhotosPanel from "./Personalfoldercomponent/PhotosPanel";
import { useDispatch, useSelector } from "react-redux";
import { setPersonalFolderContentTab } from "../Redux/Slices/TabSlice";
import ImagesFlipbookpanel from "./Personalfoldercomponent/ImagesFlipbookpanel";
import FavouritePanel from "./FavouritePanel";

const PersonalFolderContent = () => {
  const dispatch = useDispatch();
  const { personalFolderContentTab } = useSelector((state) => state.tab);

  const renderContent = () => {
    switch (personalFolderContentTab) {
      case "PhotosPanel":
        return <PhotosPanel />;
      case "flipbook":
        return <FlipbookPanel />;
      case "favourite":
        return <FavouritePanel />;
      case "ImagesFlipbookpanel":
        return <ImagesFlipbookpanel />;
      default:
        return <PhotosPanel />;
    }
  };

  return (
    <div className="flex-1 w-full px-4 sm:px-6 py-6 min-h-screen overflow-hidden">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-end gap-4 mb-4 border-b-2 border-slate pb-3">
        <div className="flex gap-2 overflow-x-auto md:overflow-visible whitespace-nowrap scrollbar-hide">
          {["PhotosPanel", "flipbook", "favourite"].map((tab) => (
            <button
              key={tab}
              onClick={() => dispatch(setPersonalFolderContentTab(tab))}
              className={`px-4 py-2 rounded-md text-sm font-medium transition shrink-0 ${
                personalFolderContentTab === tab
                  ? "bg-primary text-white"
                  : "bg-slate text-gray-800 hover:bg-primary-dark hover:text-white"
              }`}
            >
              {tab === "PhotosPanel"
                ? "PhotosPanel"
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
