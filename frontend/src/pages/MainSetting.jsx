import React, { useState } from "react";
import Basesetting from "../component/MainSettingComponents/Basesetting";
import PagesSetting from "../component/MainSettingComponents/PagesSetting";
import FaceRecognizationHistory from "../component/MainSettingComponents/FaceRecognizationHistory";

const MainSetting = () => {
  const [activeTab, setActiveTab] = useState("settings");

  const tabClass = (tab) =>
    `px-4 py-2 text-lg font-semibold transition duration-200 ${
      activeTab === tab
        ? "text-primary border-b-2 border-primary"
        : "text-muted hover:text-primary"
    }`;

  return (
    <div className="p-6">
      {/* Tab Bar */}
      <div className="flex space-x-8 border-b border-border pb-4">
        <button
          className={tabClass("settings")}
          onClick={() => setActiveTab("settings")}
        >
          Settings
        </button>
        <button
          className={tabClass("pages")}
          onClick={() => setActiveTab("pages")}
        >
          Pages
        </button>
        <button
          className={tabClass("faceRecognition")}
          onClick={() => setActiveTab("faceRecognition")}
        >
          Face Recognition History
        </button>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === "settings" && <Basesetting />}
        {activeTab === "pages" && <PagesSetting />}
        {activeTab === "faceRecognition" && <FaceRecognizationHistory />}
      </div>
    </div>
  );
};

export default MainSetting;
