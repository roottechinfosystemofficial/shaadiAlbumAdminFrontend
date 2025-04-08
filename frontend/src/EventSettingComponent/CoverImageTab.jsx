import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCoverImg, setPosition } from "../Redux/Slices/CoverImgSlice";
import {
  MdFormatAlignLeft,
  MdFormatAlignCenter,
  MdFormatAlignRight,
  MdVerticalAlignBottom,
} from "react-icons/md";

const CoverImageTab = () => {
  const dispatch = useDispatch();
  const { coverImg, position } = useSelector((state) => state.coverImg);
  const [mobileImg] = useState(
    "https://images.unsplash.com/photo-1549989317-c15a2203fd8b?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  );
  const [text] = useState("Rahul");

  useEffect(() => {
    if (!coverImg) {
      dispatch(setCoverImg("https://picsum.photos/id/1015/800/400"));
    }
  }, [coverImg, dispatch]);

  const handlePositionChange = (pos) => {
    dispatch(setPosition(pos));
  };

  const getTextPosition = () => {
    switch (position) {
      case "left":
        return "items-center justify-start text-left px-4";
      case "right":
        return "items-center justify-end text-right px-4";
      case "center":
        return "items-center justify-center text-center px-4";
      case "bottom":
        return "items-end justify-center text-center pb-6 px-4";
      default:
        return "items-center justify-center text-center px-4";
    }
  };

  const CoverContent = () => (
    <div className="flex flex-col gap-2">
      <p className="text-xl md:text-2xl font-bold uppercase">{text}</p>
      <div className="flex flex-wrap gap-2 justify-center">
        <button className="border border-white text-white text-xs px-3 py-1 rounded-md hover:bg-white hover:text-black transition">
          View Mine
        </button>
        <button className="border border-white text-white text-xs px-3 py-1 rounded-md hover:bg-white hover:text-black transition">
          View All
        </button>
        <button className="border border-white text-white text-xs px-3 py-1 rounded-md hover:bg-white hover:text-black transition">
          Upload
        </button>
      </div>
    </div>
  );

  const positionIcons = {
    left: <MdFormatAlignLeft size={20} />,
    center: <MdFormatAlignCenter size={20} />,
    right: <MdFormatAlignRight size={20} />,
    bottom: <MdVerticalAlignBottom size={20} />,
  };

  const positionLabels = {
    left: " Left",
    center: " Center",
    right: " Right",
    bottom: " Bottom",
  };

  return (
    <div className="p-4 md:p-8">
      <h2 className="text-xl font-semibold mb-6 text-gray-800">
        Cover Image Preview
      </h2>

      <div className="flex items-center flex-col md:flex-row gap-4">
        <div className="relative aspect-[16/9] w-full md:w-[60%]">
          <img
            src={coverImg}
            alt="Desktop Cover"
            className="object-cover w-full h-full"
          />
          <div
            className={`absolute inset-0 flex ${getTextPosition()} bg-black bg-opacity-40 text-white`}
          >
            <CoverContent />
          </div>
        </div>

        <div className="relative aspect-[9/12] w-[50%] md:w-[40%]">
          <img
            src={mobileImg}
            alt="Mobile Cover"
            className="object-cover w-full h-full"
          />
          <div
            className={`absolute inset-0 flex ${getTextPosition()} bg-black bg-opacity-40 text-white`}
          >
            <CoverContent />
          </div>
        </div>
      </div>

      {/* Icon Position Selector */}
      <div className="mt-10">
        <h3 className="text-sm font-semibold text-gray-800 mb-4 uppercase tracking-wide">
          Text & Button Position
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Object.entries(positionIcons).map(([pos, icon]) => (
            <button
              key={pos}
              onClick={() => handlePositionChange(pos)}
              className={`flex flex-col items-center justify-center gap-2 p-6 rounded-xl border text-sm font-medium shadow-md transition-all
          ${
            position === pos
              ? "bg-blue-600 text-white border-blue-700 scale-105 ring-2 ring-blue-300"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
          }`}
            >
              <span className="text-3xl">{icon}</span>
              <span className="text-sm font-semibold capitalize">
                {positionLabels[pos]}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CoverImageTab;
