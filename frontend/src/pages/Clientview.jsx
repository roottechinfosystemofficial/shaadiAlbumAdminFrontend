import React, { useState } from "react";
import "../css/Clientview.css";
import ClientPhotosView from "../component/ClientSideComponent/ClientPhotosView";
import { useSelector } from "react-redux";
import UnderClientView from "../component/ClientSideComponent/UnderClientView";

const Clientview = () => {
  const { position } = useSelector((state) => state.coverImg);
  const [whichView, setWhichView] = useState("");
  console.log(whichView);

  const getPositionClasses = () => {
    switch (position) {
      case "left":
        return "items-center justify-start";
      case "center":
        return "items-center justify-center";
      case "right":
        return "items-center justify-end";
      case "bottom":
        return "items-end justify-center";
      default:
        return "items-center justify-start";
    }
  };

  return (
    <>
      <div className="pics__header overflow-hidden relative md:h-[100vh] h-[50vh] bg-gray-800">
        <div
          className={`absolute inset-0 text-white flex p-4 md:p-8 ${getPositionClasses()}`}
        >
          <div className="flex flex-col items-start">
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
      {whichView === "photos" ? (
        <ClientPhotosView setWhichView={setWhichView} />
      ) : (
        <UnderClientView setWhichView={setWhichView} />
      )}
    </>
  );
};

export default Clientview;
