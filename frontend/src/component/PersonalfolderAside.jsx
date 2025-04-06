import React, { useState } from "react";
import boximg from "../assets/box1.png";
import { EditIcon, Trash2, MoreVertical, Settings2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PersonalfolderAside = () => {
  const [showOptions, setShowOptions] = useState(false);
  const navigate = useNavigate();

  return (
    <aside className="w-full max-w-md sm:max-w-full p-4 bg-white border-r border-gray-200 text-gray-900 space-y-6">
      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => navigate("/eventsetting")}
          className="flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-800 text-white font-medium text-sm py-2 rounded-md shadow-sm"
        >
          <Settings2 size={18} />
          Event Settings
        </button>
        <button className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-medium py-2 text-sm rounded-md shadow-sm">
          <Trash2 size={18} />
          Delete Event
        </button>
      </div>

      {/* Event Info */}
      <div className="space-y-1">
        <h2 className="text-xl font-semibold">RAHUL</h2>
        <div className="flex justify-between text-sm text-gray-800">
          <p>Apr 3rd 2025</p>
          <p className="text-green-600 font-semibold">Published</p>
        </div>
        <div className="flex justify-between text-sm text-gray-800">
          <p>Total Images:</p>
          <p>0</p>
        </div>
      </div>

      {/* Folder Image */}
      <div className="relative border rounded-lg overflow-hidden shadow-sm">
        <img
          src={boximg}
          alt="Folder Cover"
          className="w-full h-40 object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black/50 opacity-0 hover:opacity-100 transition">
          <button className="bg-white p-2 rounded-full shadow hover:bg-gray-100">
            <Trash2 size={18} className="text-red-600" />
          </button>
          <button className="bg-white p-2 rounded-full shadow hover:bg-gray-100">
            <EditIcon size={18} className="text-blue-600" />
          </button>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <textarea
          placeholder="Add Description (max 250 characters)"
          maxLength={250}
          className="w-full p-3 border border-gray-300 rounded-md shadow-sm resize-none bg-white text-gray-800 focus:outline-none focus:border-blue-500 text-sm"
        />
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium shadow">
          Update
        </button>
      </div>

      {/* Event Details */}
      <div className="space-y-4 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
        <div>
          <p className="text-xs text-gray-500">Event Code:</p>
          <div className="flex justify-between items-center">
            <p className="font-semibold text-gray-900">205462</p>
            <button className="text-blue-600 text-xs hover:underline">
              Copy
            </button>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => window.open("/1/clientview", "_blank")}
            className="flex-1 bg-gray-100 border text-sm py-1.5 rounded hover:bg-gray-200 font-medium"
          >
            Preview
          </button>

          <button className="flex-1 bg-gray-100 border text-sm py-1.5 rounded hover:bg-gray-200 font-medium">
            Insights
          </button>
        </div>

        {/* Sub Events */}
        <div className="border-t pt-3">
          <div className="flex justify-between items-center text-sm font-medium">
            <p>Sub-Events</p>
            <button className="text-blue-600 text-xs hover:underline">
              + Add New
            </button>
          </div>

          <div className="mt-2 flex justify-between items-center bg-gray-50 border rounded-md px-3 py-2 shadow-sm">
            <div className="flex items-center gap-2 text-gray-900">
              <span className="text-yellow-500">✨</span>
              <p className="font-medium">Highlights</p>
              <span className="text-xs bg-gray-200 px-2 py-0.5 rounded-full text-gray-700">
                4
              </span>
            </div>

            <div className="relative">
              <button onClick={() => setShowOptions(!showOptions)}>
                <MoreVertical size={18} className="text-gray-500" />
              </button>

              {showOptions && (
                <div className="absolute right-0 mt-2 w-44 bg-white text-gray-900 rounded-md shadow-lg z-10 text-sm border">
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-100">
                    Make Private
                  </button>
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-100">
                    Rename
                  </button>
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-100">
                    Delete All Images
                  </button>
                  <button className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50">
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default PersonalfolderAside;
