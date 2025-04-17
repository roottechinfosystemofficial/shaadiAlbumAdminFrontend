import React, { useState } from "react";
import boximg from "../assets/box1.png";
import { EditIcon, Trash2, MoreVertical, Settings2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PersonalfolderAside = () => {
  const [showOptions, setShowOptions] = useState(false);
  const navigate = useNavigate();

  return (
    <aside className="w-full max-w-md sm:max-w-full p-4 bg-white border-r border-slate text-gray-900 space-y-6">
      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => navigate("/eventsetting")}
          className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-medium text-sm py-2.5 rounded-lg transition shadow"
        >
          <Settings2 size={18} />
          Event Settings
        </button>
        <button className="flex items-center justify-center gap-2 bg-rose-500 hover:bg-rose-600 text-white font-medium text-sm py-2.5 rounded-lg transition shadow">
          <Trash2 size={18} />
          Delete Event
        </button>
      </div>

      {/* Event Info */}
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-gray-900">Dhruv</h2>
        <div className="flex justify-between text-sm text-gray-500">
          <p>Apr 3rd 2025</p>
          <p className="text-emerald-600 font-semibold">Published</p>
        </div>
        <div className="flex justify-between text-sm text-gray-500">
          <p>Total Images:</p>
          <p>0</p>
        </div>
      </div>

      {/* Folder Image */}
      <div className="relative border border-slate rounded-xl overflow-hidden shadow-sm">
        <img
          src={boximg}
          alt="Folder Cover"
          className="w-full h-44 object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black/50 opacity-0 hover:opacity-100 transition-opacity duration-300">
          <button className="bg-white p-2 rounded-full shadow hover:bg-slate transition">
            <Trash2 size={18} className="text-rose-600" />
          </button>
          <button className="bg-white p-2 rounded-full shadow hover:bg-slate transition">
            <EditIcon size={18} className="text-primary" />
          </button>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <textarea
          placeholder="Add Description (max 250 characters)"
          maxLength={250}
          className="w-full p-3 border border-slate rounded-lg shadow-sm resize-none bg-white text-sm text-gray-800 focus:outline-none focus:border-primary"
        />
        <button className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md text-sm font-medium shadow transition">
          Update
        </button>
      </div>

      {/* Event Details */}
      <div className="space-y-4 p-4 bg-white border border-slate rounded-xl shadow-sm pb-24">
        <div>
          <p className="text-xs text-gray-500">Event Code:</p>
          <div className="flex justify-between items-center">
            <p className="font-semibold text-gray-900">205462</p>
            <button className="text-primary text-xs hover:underline">
              Copy
            </button>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => navigate("/1/clientview")}
            className="flex-1 bg-slate hover:bg-primary-dark hover:text-white text-sm py-2.5 rounded-xl font-medium shadow-md transition duration-400"
          >
            Preview
          </button>
          <button className="flex-1 bg-slate text-gray-800 hover:text-white hover:bg-primary-dark text-sm py-2.5 rounded-xl font-medium shadow-sm transition duration-400">
            Insights
          </button>
        </div>

        {/* Sub Events */}
        <div className="border-t border-slate pt-3">
          <div className="flex justify-between items-center text-sm font-medium mb-2">
            <p>Sub-Events</p>
            <button className="text-primary text-xs hover:underline">
              + Add New
            </button>
          </div>

          <div className="flex justify-between mb-5 items-center bg-slate border border-slate rounded-lg px-3 py-2 shadow-sm">
            <div className="flex items-center gap-2 text-gray-900">
              <span className="text-yellow-500">✨</span>
              <p className="font-medium">Highlights</p>
              <span className="text-xs bg-white px-2 py-0.5 rounded-full text-gray-700 border border-slate">
                4
              </span>
            </div>

            <div className="relative">
              <button onClick={() => setShowOptions(!showOptions)}>
                <MoreVertical size={18} className="text-gray-500" />
              </button>

              {showOptions && (
                <div className="absolute top-[0%] left-[100%] w-44 bg-white text-gray-900 rounded-md shadow-lg z-10 text-sm border border-slate overflow-hidden">
                  <button className="w-full text-left px-4 py-2 hover:bg-slate">
                    Make Private
                  </button>
                  <button className="w-full text-left px-4 py-2 hover:bg-slate">
                    Rename
                  </button>
                  <button className="w-full text-left px-4 py-2 hover:bg-slate">
                    Delete All Images
                  </button>
                  <button className="w-full text-left px-4 py-2 text-rose-600 hover:bg-rose-50">
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 ">
          <button
            onClick={() => navigate("/standyshow")}
            className="col-span-2 flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-medium text-sm py-2.5 rounded-lg transition shadow"
          >
            FaceScan Pre Registration
          </button>
        </div>
      </div>
    </aside>
  );
};

export default PersonalfolderAside;
