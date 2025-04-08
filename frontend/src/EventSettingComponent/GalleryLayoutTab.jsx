import React, { useEffect } from "react";
import clsx from "clsx";
import { useDispatch, useSelector } from "react-redux";
import {
  setLayout,
  setSpacing,
  setThumbnail,
  setBackground,
} from "../Redux/Slices/GalleryLayoutSlice";
import { LayoutGrid, Rows, Image, SunMoon } from "lucide-react";

const optionsMap = {
  layout: {
    icon: <LayoutGrid className="w-4 h-4 mr-2" />,
    title: "Layout Style",
    options: [
      { label: "Vertical", value: "vertical" },
      { label: "Horizontal", value: "horizontal" },
    ],
  },
  spacing: {
    icon: <Rows className="w-4 h-4 mr-2" />,
    title: "Grid Spacing",
    options: [
      { label: "Small", value: "small" },
      { label: "Regular", value: "regular" },
      { label: "Large", value: "large" },
    ],
  },
  thumbnail: {
    icon: <Image className="w-4 h-4 mr-2" />,
    title: "Thumbnail Size",
    options: [
      { label: "Small", value: "small" },
      { label: "Medium", value: "regular" },
      { label: "Large", value: "large" },
    ],
  },
  background: {
    icon: <SunMoon className="w-4 h-4 mr-2" />,
    title: "Theme Mode",
    options: [
      { label: "Light", value: "light" },
      { label: "Dark", value: "dark" },
    ],
  },
};

const SettingGroup = ({ icon, title, options, selected, onChange }) => (
  <div className="bg-gray-50 rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition duration-300">
    <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center capitalize tracking-wide">
      {icon}
      {title}
    </h4>
    <div className="flex flex-wrap gap-3">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={clsx(
            "px-4 py-2 rounded-full border text-sm font-medium transition-all duration-200 shadow-sm",
            selected === opt.value
              ? "bg-indigo-600 text-white border-indigo-600 shadow-md ring-2 ring-indigo-300"
              : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100 hover:shadow"
          )}
        >
          {opt.label}
      </button>
      ))}
    </div>
  </div>
);

const GalleryLayoutTab = ({ onChange }) => {
  const dispatch = useDispatch();
  const settings = useSelector((state) => state.galleryLayout);

  useEffect(() => {
    if (onChange) onChange(settings);
  }, [settings, onChange]);

  const updateSetting = (key, value) => {
    switch (key) {
      case "layout":
        dispatch(setLayout(value));
        break;
      case "spacing":
        dispatch(setSpacing(value));
        break;
      case "thumbnail":
        dispatch(setThumbnail(value));
        break;
      case "background":
        dispatch(setBackground(value));
        break;
      default:
        break;
    }
  };

  return (
    <div className="space-y-6 bg-white text-gray-900 p-6 rounded-2xl border border-gray-200 shadow-xl max-w-5xl mx-auto">
      <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
        🎨 Customize Your Gallery View
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
        {Object.entries(optionsMap).map(([key, config]) => (
          <SettingGroup
            key={key}
            icon={config.icon}
            title={config.title}
            options={config.options}
            selected={settings[key]}
            onChange={(val) => updateSetting(key, val)}
          />
        ))}
      </div>
    </div>
  );
};

export default GalleryLayoutTab;
