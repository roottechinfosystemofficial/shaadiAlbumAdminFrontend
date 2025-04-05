import React from "react";
import "../css/Clientview.css";
const Clientview = () => {
  return (
    <>
      <div className="pics__header overflow-hidden relative md:h-[100vh] ">
        <div className="text-white flex items-center justify-center h-full">
          <div className="flex flex-col">
            <p className="text-3xl uppercase pb-4 font-extrabold">Rahul</p>
            <div className="flex items-center justify-center gap-5">
              <button className=" border-2 border-white py-1 px-4 rounded-md">
                View Mine
              </button>
              <button className="border-2 border-white py-1 px-4 rounded-md">
                View All
              </button>
              <button className="border-2 border-white py-1 px-4 rounded-md">
                Upload
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Clientview;
