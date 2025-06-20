import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCoverImg, setPosition } from "../../Redux/Slices/CoverImgSlice";
import {
  MdFormatAlignLeft,
  MdFormatAlignCenter,
  MdFormatAlignRight,
  MdVerticalAlignBottom,
} from "react-icons/md";
import apiRequest from "../../utils/apiRequest";
import { S3_API_END_POINT } from "../../constant";

const CoverImageTab = () => {
  const dispatch = useDispatch();
  const { coverImg, position } = useSelector((state) => state.coverImg);
    const { currentEvent,currentSubEvent } = useSelector((state) => state.event);
  

  console.log("coverImage path",coverImg)
  const [mobileImg] = useState(
    "https://images.unsplash.com/photo-1549989317-c15a2203fd8b?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  );
  const [text] = useState("Dhruv");


  const setCoverImageByFetching=async()=>{
    try {
      const response = await apiRequest(
        'GET',
        `${S3_API_END_POINT}/cover-image?eventId=${currentEvent?._id}&subEventId=${currentSubEvent?._id}`
      );
      dispatch(setCoverImg(response.data.url))
      
      console.log(response.data.url)

    }
    catch(error){
      console.log("cover image tab error",error)

    }

  }
  useEffect(()=>{
    setCoverImageByFetching()
  },[])

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
        {["View Mine", "View All", "Upload"].map((label) => (
          <button
            key={label}
            className="border border-white text-white text-xs px-3 py-1 rounded-md hover:bg-white hover:text-black transition"
          >
            {label}
          </button>
        ))}
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
    left: "Left",
    center: "Center",
    right: "Right",
    bottom: "Bottom",
  };

  return (
    <div className="p-4 md:p-8">
      <h2 className="text-xl font-semibold mb-6 text-slate-800">
        Cover Image Preview
      </h2>

      <div className="flex items-center flex-col md:flex-row gap-4">
        {/* Desktop Preview */}
        <div className="relative aspect-[16/9] w-full md:w-[60%] rounded-xl overflow-hidden shadow">
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

        {/* Mobile Preview */}
        <div className="relative aspect-[9/12] w-[50%] md:w-[40%] rounded-xl overflow-hidden shadow">
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

      {/* Position Controls */}
      <div className="mt-10">
        <h3 className="text-sm font-semibold text-slate-800 mb-4 uppercase tracking-wide">
          Text & Button Position
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Object.entries(positionIcons).map(([pos, icon]) => (
            <button
              key={pos}
              onClick={() => handlePositionChange(pos)}
              className={`flex flex-col items-center justify-center gap-2 p-6 rounded-xl border text-sm font-medium transition-all shadow
              ${
                position === pos
                  ? "bg-primary text-white border-primary-dark scale-105 ring-2 ring-primary"
                  : "bg-slate text-slate-800 border-slate-dark hover:bg-slate-dark hover:text-white"
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
