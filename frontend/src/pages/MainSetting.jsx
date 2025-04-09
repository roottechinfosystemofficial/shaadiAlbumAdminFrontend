import React, { useState } from "react";
import Basesetting from "../MainSettingComponents/Basesetting";
import PagesSetting from "../MainSettingComponents/PagesSetting";
import FaceRecognizationHistory from "../MainSettingComponents/FaceRecognizationHistory";

const MainSetting = () => {
  // State to track the active tab
  const [activeTab, setActiveTab] = useState("settings");

  return (
    <div className="p-6">
      {/* Tab Bar */}
      <div className="flex space-x-8 border-b border-gray-300 pb-4">
        <button
          className={`px-4 py-2 text-lg font-semibold ${
            activeTab === "settings"
              ? "text-indigo-600 border-b-2 border-indigo-600"
              : "text-gray-600"
          }`}
          onClick={() => setActiveTab("settings")}
        >
          Settings
        </button>
        <button
          className={`px-4 py-2 text-lg font-semibold ${
            activeTab === "pages"
              ? "text-indigo-600 border-b-2 border-indigo-600"
              : "text-gray-600"
          }`}
          onClick={() => setActiveTab("pages")}
        >
          Pages
        </button>
        <button
          className={`px-4 py-2 text-lg font-semibold ${
            activeTab === "faceRecognition"
              ? "text-indigo-600 border-b-2 border-indigo-600"
              : "text-gray-600"
          }`}
          onClick={() => setActiveTab("faceRecognition")}
        >
          Face Recognition History
        </button>
      </div>

      {/* Content */}
      <div className="mt-6">
        {/* Settings Tab Content */}
        {activeTab === "settings" && <Basesetting />}

        {/* Pages Tab Content */}
        {activeTab === "pages" && <PagesSetting />}

        {/* Face Recognition History Tab Content */}
        {activeTab === "faceRecognition" && <FaceRecognizationHistory />}
      </div>
    </div>
  );
};

export default MainSetting;
