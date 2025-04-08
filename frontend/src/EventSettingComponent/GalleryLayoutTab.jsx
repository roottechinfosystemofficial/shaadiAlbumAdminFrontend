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
    icon: <LayoutGrid className="w-5 h-5 mr-3" />,
    title: "Layout Style",
    options: [
      { label: "Vertical", value: "vertical" },
      { label: "Horizontal", value: "horizontal" },
    ],
  },
  spacing: {
    icon: <Rows className="w-5 h-5 mr-3" />,
    title: "Grid Spacing",
    options: [
      { label: "Small", value: "small" },
      { label: "Regular", value: "regular" },
      { label: "Large", value: "large" },
    ],
  },
  thumbnail: {
    icon: <Image className="w-5 h-5 mr-3" />,
    title: "Thumbnail Size",
    options: [
      { label: "Small", value: "small" },
      { label: "Medium", value: "regular" },
      { label: "Large", value: "large" },
    ],
  },
  background: {
    icon: <SunMoon className="w-5 h-5 mr-3" />,
    title: "Theme Mode",
    options: [
      { label: "Light", value: "light" },
      { label: "Dark", value: "dark" },
    ],
  },
};

const SettingGroup = ({ icon, title, options, selected, onChange }) => (
  <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-200 hover:shadow-xl transition duration-300">
    <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center capitalize">
      {icon}
      {title}
    </h4>
    <div className="flex flex-wrap gap-6">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={clsx(
            "px-6 py-3 rounded-lg text-base font-semibold transition-all duration-300",
            selected === opt.value
              ? "bg-indigo-600 text-white border-indigo-600 shadow-xl ring-2 ring-indigo-300"
              : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100 hover:shadow-md"
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
    <div className="space-y-10 bg-gray-50 text-gray-900 p-8 rounded-2xl border border-gray-200 shadow-2xl max-w-5xl mx-auto">
      <h3 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        🎨 Customize Your Gallery View
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
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
