import React, { useState } from "react";
import boximg from "../assets/box1.png";
import { Cog, EditIcon, Eye, Folders, Share2, Trash2 } from "lucide-react";
import FolderPanel from "./FolderPanel";
import SettingsPanel from "./SettingsPanel";
import ActivitiesPanel from "./ActivitiesPanel";

const PersonalfolderAside = () => {
  const [activePanel, setActivePanel] = useState("folders");
  const [activeItem, setActiveItem] = useState("");

  const renderPanel = () => {
    switch (activePanel) {
      case "folders":
        return (
          <FolderPanel activeItem={activeItem} onItemClick={setActiveItem} />
        );
      case "settings":
        return (
          <SettingsPanel activeItem={activeItem} onItemClick={setActiveItem} />
        );
      case "share":
        return (
          <ActivitiesPanel
            activeItem={activeItem}
            onItemClick={setActiveItem}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-3 text-sm text-gray-800 border-r-2 pr-2 w-full max-w-md sm:max-w-full sm:px-4">
      <p className="font-semibold text-base sm:text-lg">RAHUL (VPXL8U)</p>
      <div className="flex justify-between text-xs sm:text-sm">
        <p>Apr 3rd 2025</p>
        <p className="text-green-600 font-medium">Published</p>
      </div>
      <div className="flex justify-between text-xs sm:text-sm">
        <p>Total Images:</p>
        <p>0</p>
      </div>

      <div className="relative mt-3 border rounded-md overflow-hidden">
        <img src={boximg} alt="Folder Cover" className="w-full object-cover" />
        <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black/40 opacity-0 hover:opacity-100 transition">
          <button className="bg-white p-2 rounded-full shadow">
            <Trash2 size={18} className="text-red-500" />
          </button>
          <button className="bg-white p-2 rounded-full shadow">
            <EditIcon size={18} className="text-blue-500" />
          </button>
        </div>
      </div>

      {/* Icon Tabs */}
      <div className="py-5 border-b-2 border-gray-800">
        <ul className="flex justify-around text-gray-600 text-lg">
          <li
            onClick={() => {
              setActivePanel("folders");
              setActiveItem("");
            }}
            className={`cursor-pointer transition ${
              activePanel === "folders" ? "text-blue-600" : "hover:text-black"
            }`}
          >
            <Folders />
          </li>
          <li
            onClick={() => {
              setActivePanel("settings");
              setActiveItem("");
            }}
            className={`cursor-pointer transition ${
              activePanel === "settings" ? "text-blue-600" : "hover:text-black"
            }`}
          >
            <Cog />
          </li>
          <li
            onClick={() => {
              setActivePanel("share");
              setActiveItem("");
            }}
            className={`cursor-pointer transition ${
              activePanel === "share" ? "text-blue-600" : "hover:text-black"
            }`}
          >
            <Share2 />
          </li>
        </ul>
      </div>

      {/* Render Selected Panel */}
      <div className="h-96 overflow-y-auto">{renderPanel()}</div>

      <div className="mb-10 pt-3 border-t-2 border-gray-500 flex flex-wrap gap-3 items-center justify-between sm:justify-around mt-4">
        <button className="bg-gray-800 text-white px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-200 hover:text-gray-800 transition-colors duration-200 flex items-center gap-2 w-full sm:w-auto justify-center">
          <Eye size={16} />
          View
        </button>
        <button className="bg-gray-800 text-white px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-200 hover:text-gray-800 transition-colors duration-200 flex items-center gap-2 w-full sm:w-auto justify-center">
          Share
        </button>
        <button className="bg-gray-800 text-white px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-200 hover:text-gray-800 transition-colors duration-200 flex items-center gap-2 w-full sm:w-auto justify-center">
          Notify To Users
        </button>
      </div>
    </div>
  );
};

export default PersonalfolderAside;
