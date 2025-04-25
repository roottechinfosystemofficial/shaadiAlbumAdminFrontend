import React, { useState } from "react";
import { MoreVertical, Trash2, EditIcon } from "lucide-react";

const SubEventSection = () => {
  const [showOptions, setShowOptions] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [subEventName, setSubEventName] = useState("");

  const handleCreateSubEvent = async () => {
    if (!subEventName.trim()) return;
    console.log("Creating Sub-Event:", subEventName);
    try {
      console.log();
    } catch (error) {
      console.log(error);
    }
    setSubEventName("");
    setShowInput(false);
  };

  return (
    <div className="border-t border-slate pt-3">
      <div className="flex justify-between items-center text-sm font-medium mb-2">
        <p>Sub-Events</p>
        <button
          className="text-primary text-xs hover:underline"
          onClick={() => setShowInput(!showInput)}
        >
          + Add New
        </button>
      </div>

      {/* Add new sub-event input */}
      {showInput && (
        <div className="flex items-center gap-2 mb-4">
          <input
            type="text"
            value={subEventName}
            onChange={(e) => setSubEventName(e.target.value)}
            placeholder="Enter sub-event name"
            className="flex-1 px-3 py-2 border rounded-md text-sm"
          />
          <button
            onClick={handleCreateSubEvent}
            className="bg-primary hover:bg-primary-dark text-white text-sm px-4 py-2 rounded-md"
          >
            Create
          </button>
        </div>
      )}

      {/* Example Sub-event item */}
      <div className="flex justify-between items-center bg-slate border border-slate rounded-lg px-3 py-2 shadow-sm mb-5">
        <div className="flex items-center gap-2">
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
            <div className="absolute top-0 left-full w-44 bg-white text-gray-900 rounded-md shadow-lg z-10 text-sm border border-slate overflow-hidden">
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
  );
};

export default SubEventSection;
