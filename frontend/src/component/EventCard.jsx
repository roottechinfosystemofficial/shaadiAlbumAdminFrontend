import React, { useState } from "react";
import { RefreshCw, MoreVertical, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

const EventCard = ({ event, onEdit, onDelete }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden w-full max-w-xs mx-auto relative">
      {/* Event Image & More Options */}
      <div className="relative cursor-pointer">
        <img
          src={event.image}
          alt={event.name}
          className="w-full h-40 object-cover"
          onClick={() => {
            navigate(`/personalfolder/${1}`);
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
                onEdit(event.id);
                setIsDropdownOpen(false);
              }}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              Edit
            </button>
            <button
              onClick={() => {
                onDelete(event.id);
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
        <h3 className="text-lg font-semibold text-center">{event.name}</h3>
        <div className="flex justify-between text-sm text-gray-600 mt-2">
          <p>{event.date}</p>
          <p
            className={`font-semibold ${
              event.published ? "text-green-600" : "text-red-600"
            }`}
          >
            {event.published ? "Published" : "Unpublished"}
          </p>
        </div>
        <div className="flex justify-between items-center text-sm text-gray-600 mt-3">
          <div className="flex items-center gap-2">
            <span>{event.code}</span>
            <RefreshCw
              size={16}
              className="cursor-pointer hover:text-blue-600"
            />
          </div>
          <div className="flex items-center gap-2">
            <span>Password</span>
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
