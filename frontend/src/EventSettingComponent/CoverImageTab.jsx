import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCoverImg, setPosition } from "../Redux/Slices/CoverImgSlice";

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

  return (
    <div className="p-4 md:p-8">
      <h2 className="text-xl font-semibold mb-6 text-gray-800">
        Cover Image Preview
      </h2>

      <div className="flex items-center flex-col md:flex-row  gap-4">
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

      {/* Position Buttons */}
      <div className="mt-6">
        <h3 className="font-medium text-gray-700 mb-2">
          Text & Button Position
        </h3>
        <div className="flex flex-wrap gap-3">
          {["left", "right", "center", "bottom"].map((pos) => (
            <button
              key={pos}
              onClick={() => handlePositionChange(pos)}
              className={`px-4 py-2 rounded-lg border transition-all text-sm ${
                position === pos
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {pos.charAt(0).toUpperCase() + pos.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CoverImageTab;
