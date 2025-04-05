import React from "react";
import "../css/Clientview.css";
import {
  ArrowDownToLineIcon,
  Edit,
  Heart,
  ScanFace,
  Share2,
  ShoppingCart,
  Upload,
} from "lucide-react";

const Clientview = () => {
  return (
    <>
      <div className="pics__header overflow-hidden relative md:h-[100vh] h-[50vh]">
        <div className="text-white flex items-center justify-start p-4 md:p-8 h-full">
          <div className="flex flex-col">
            <p className="text-2xl md:text-3xl uppercase pb-2 md:pb-4 font-extrabold">
              Rahul
            </p>
            <div className="flex flex-wrap gap-4 md:gap-10">
              <button className="border-2 border-white py-1 px-3 md:px-4 rounded-md text-sm md:text-base">
                View Mine
              </button>
              <button className="border-2 border-white py-1 px-3 md:px-4 rounded-md text-sm md:text-base">
                View All
              </button>
              <button className="border-2 border-white py-1 px-3 md:px-4 rounded-md text-sm md:text-base">
                Upload
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[90%] mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between py-6 gap-4">
          <div>
            <p className="text-xl md:text-2xl font-bold">RAHUL</p>
            <span className="text-sm text-gray-600">dyhrf</span>
          </div>
          <div className="flex flex-wrap gap-3 md:gap-4">
            <button className="flex items-center gap-1 md:gap-2 text-sm md:text-base">
              <ScanFace className="w-4 h-4 md:w-5 md:h-5" /> Face Search
            </button>
            <button className="flex items-center gap-1 md:gap-2 text-sm md:text-base">
              <Heart className="w-4 h-4 md:w-5 md:h-5" /> Favourites
            </button>
            <button>
              <Upload className="w-4 h-4 md:w-5 md:h-5" />
            </button>
            <button>
              <ShoppingCart className="w-4 h-4 md:w-5 md:h-5" />
            </button>
            <button>
              <Share2 className="w-4 h-4 md:w-5 md:h-5" />
            </button>
            <button>
              <ArrowDownToLineIcon className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </div>
        </div>

        <div>
          <h1 className="text-xl md:text-3xl py-2 md:py-4 font-semibold">
            Highlights
          </h1>
        </div>
      </div>
    </>
  );
};

export default Clientview;
