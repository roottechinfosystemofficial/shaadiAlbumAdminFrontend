import React, { useState } from "react";
import { RefreshCw, MoreVertical, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

const EventCard = ({ event, onEdit, onDelete }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const eventImage = event?.eventImage || "fallback-image-url"; // Add a fallback image URL
  const eventName = event?.eventName || "Untitled Event"; // Fallback text for missing name
  const eventDate = event?.eventDate
    ? new Date(event.eventDate).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "No Date Provided"; // Fallback for missing eventDate
  const eventCode = event?.eventCode || "N/A"; // Fallback for missing eventCode
  const eventPassword = event?.eventPassword || "N/A"; // Fallback for missing eventPassword
  const isPublished = event?.isPublished || false; // Default to unpublished if not defined

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden w-full max-w-xs mx-auto relative">
      {/* Event Image & More Options */}
      <div className="relative cursor-pointer">
        <img
          src={eventImage} // Display fallback image if eventImage is not available
          alt={eventName} // Display fallback name if eventName is not available
          className="w-full h-40 object-cover"
          onClick={() => {
            navigate(`/personalfolder/${event?._id || 1}`); // Fall back to 1 if event._id is missing
          }}
        />
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-black p-2 rounded-full bg-white shadow"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <MoreVertical size={20} />
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute top-10 right-2 bg-white shadow-lg rounded-md w-32">
            <button
              onClick={() => {
                onEdit(event?._id);
                setIsDropdownOpen(false);
              }}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              Edit
            </button>
            <button
              onClick={() => {
                onDelete(event?._id);
                setIsDropdownOpen(false);
              }}
              className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Event Details */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-center">{eventName}</h3>
        <div className="flex justify-between text-sm text-gray-600 mt-2">
          <p>{eventDate}</p>

          <p
            className={`font-semibold ${
              isPublished ? "text-green-600" : "text-red-600"
            }`}
          >
            {isPublished ? "Published" : "Unpublished"}
          </p>
        </div>
        <div className="flex justify-between items-center text-sm text-gray-600 mt-3">
          <div className="flex items-center gap-2">
            <span>{eventCode}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>
              {showPassword ? eventPassword : "********"}
              {/* Toggle password visibility */}
            </span>
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-600 hover:text-black"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
