import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import GeneralTab from "../EventSettingComponent/GeneralTab";
import GalleryLayoutTab from "../EventSettingComponent/GalleryLayoutTab";
import DownloadsTab from "../EventSettingComponent/DownloadsTab";
import SharingTab from "../EventSettingComponent/SharingTab";
import CoverImageTab from "../EventSettingComponent/CoverImageTab";

const tabs = [
  "General",
  "Cover Image",
  "Gallery layout",
  "Downloads",
  "Sharing",
];

const tabComponents = {
  General: GeneralTab,
  "Cover Image": CoverImageTab,
  "Gallery layout": GalleryLayoutTab,
  Downloads: DownloadsTab,
  Sharing: SharingTab,
};

const EventSetting = () => {
  const [activeTab, setActiveTab] = useState("General");
  const ActiveComponent = tabComponents[activeTab];
  const navigate = useNavigate();
  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-6 border-b pb-4">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm text-blue-600 font-medium px-3 py-1.5 border border-transparent rounded-md hover:border-blue-600 hover:bg-blue-50 transition-all"
        >
          <ArrowLeft size={18} />
          Back
        </button>
        <h2 className="text-xl font-semibold text-gray-800">Event Setting</h2>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-3 border-b pb-3">
        {tabs.map((tab, idx) => (
          <button
            key={idx}
            onClick={() => setActiveTab(tab)}
            className={`text-sm px-4 py-2 rounded-full font-medium transition-all ${
              activeTab === tab
                ? "bg-blue-100 text-blue-600"
                : "text-gray-700 bg-gray-100 hover:bg-blue-50 hover:text-blue-600"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Active Tab Content */}
      <div>
        <ActiveComponent />
      </div>
    </div>
  );
};

export default EventSetting;
