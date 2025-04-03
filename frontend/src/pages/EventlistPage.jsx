import React from "react";

const EventlistPage = () => {
  return (
    <>
      <div className="max-w-6xl m-auto flex items-center justify-between mt-10">
        <p className="text-3xl">Event List</p>
        <div className="flex items-center gap-5">
          <button className="bg-slate-400 p-3">Default Setting</button>
          <button className="bg-[green] text-white p-3">Add Event</button>
        </div>
      </div>
      <div className="max-w-6xl mt-5 mx-auto">
        <hr className="border-t-2 border-gray-800" />
      </div>
    </>
  );
};

export default EventlistPage;
