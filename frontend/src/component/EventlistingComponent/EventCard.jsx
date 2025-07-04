import React, { useState } from "react";
import { RefreshCw, MoreVertical, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCurrentEventId, setEventImage } from "../../Redux/Slices/EventSlice";


const EventCard = ({ event, onEdit, onDelete, setOpenEditModel }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const eventImage = event?.eventImage || "fallback-image-url";
  const eventName = event?.eventName || "Untitled Event";
  const eventDate = event?.eventDate
    ? new Date(event.eventDate).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "No Date Provided";
  const eventCode = event?.eventCode || "N/A";
  const eventPassword = event?.eventPassword || "N/A";
  const isPublished = event?.isPublished || false;

  const totalImages = event?.eventTotalImages || "";
  const totalSubEvents = event?.subevents?.length || "";

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden w-full max-w-xs mx-auto relative">
      {/* Event Image & More Options */}
      <div className="relative cursor-pointer">
        <img
          src={eventImage?.startsWith("http") ? eventImage : 'https://picsum.photos/id/1015/800/400'}

          alt={eventName}
          className="w-full h-40 object-cover"
          onClick={() => {
            navigate(`/personalfolder/${event?._id}`);
            dispatch(setCurrentEventId(event?._id));
            dispatch(setEventImage(event?.eventImage))
          }}
        />
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-black p-2 rounded-full bg-white shadow"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <MoreVertical size={20} />
        </button>

        {isDropdownOpen && (
          <div className="absolute top-10 right-2 bg-white shadow-lg rounded-md w-32 z-10">
            <button
              onClick={() => {
                onEdit(event?._id);
                setOpenEditModel(true);
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
        {/* Images & Sub-events */}
        <div className="text-xs text-gray-500 mt-1 text-center font-semibold">
          {totalImages} Photos | {totalSubEvents} Sub-events
        </div>
        {/* Event Date & Publish Status */}
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

        {/* Event Code & Password */}
        <div className="flex justify-between items-center text-sm text-gray-600 mt-3">
          <div className="flex items-center gap-2">
            <span>{eventCode}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>{showPassword ? eventPassword : "********"}</span>
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
