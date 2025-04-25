import React, { useState } from "react";
import boximg from "../assets/box1.png";
import { EditIcon, Trash2, MoreVertical, Settings2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setSingleEvent } from "../Redux/Slices/EventSlice";
import { useGetEventImagesCount } from "../Hooks/useGetEventImagesCount";
import { editEvent } from "../utils/editEvents.util.js";
import toast from "../utils/toast.js";

const PersonalfolderAside = ({ singleEvent }) => {
  const [showOptions, setShowOptions] = useState(false);
  const navigate = useNavigate();
  const { eventId } = useParams();
  const { accessToken } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const imageCount = useGetEventImagesCount(singleEvent?._id);

  const eventDate = singleEvent?.eventDate
    ? new Date(singleEvent.eventDate).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "No Date Provided";

  const isPublished = singleEvent?.isPublished || false;

  const togglePublishStatus = async () => {
    const newStatus = !isPublished;
    const payload = {
      isPublished: newStatus,
      ...(imageCount && { imageCount }),
    };
    try {
      const res = await editEvent(
        singleEvent?._id,
        payload,
        dispatch,
        accessToken
      );
      dispatch(setSingleEvent(res.data.data));
      toast.success(
        `Event ${newStatus ? "published" : "unpublished"} successfully!`
      );
    } catch (error) {
      toast.error("Failed to update publish status.");
      console.error("Error updating publish status:", error);
    }
  };

  return (
    <aside className="p-4 text-gray-900 space-y-6 sidebar-content">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

      <div className="space-y-1">
        <h2 className="text-2xl font-bold">{singleEvent?.eventName}</h2>
        <div className="flex justify-between text-sm text-gray-500">
          <p>{eventDate}</p>
        </div>

        {/* ✅ Updated Publish Toggle */}
        <div className="flex items-center justify-between bg-white border border-slate-200 rounded-lg px-3 py-2 shadow-sm hover:bg-slate-50 transition-all duration-300">
          <div className="flex items-center gap-3">
            {/* Status Indicator with Icon */}
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isPublished ? "bg-green-500" : "bg-red-500"
              }`}
              title={
                isPublished
                  ? "Event is Published and Visible"
                  : "Event is Unpublished and Hidden"
              }
            ></span>
            <div className="flex flex-col">
              <p className="text-sm font-medium text-gray-800">
                {isPublished ? "Event Published" : "Event Unpublished"}
              </p>
              {/* Public Availability Status */}
              <p className="text-xs text-gray-500">
                {isPublished ? "Publicly Available" : "Not Available to Public"}
              </p>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={togglePublishStatus}
            className={`text-xs font-medium rounded-lg px-3 py-1.5 transition-all ${
              isPublished
                ? "bg-red-100 text-red-600 hover:bg-red-200"
                : "bg-green-100 text-green-600 hover:bg-green-200"
            }`}
            title={isPublished ? "Click to Unpublish" : "Click to Publish"}
          >
            {isPublished ? "Unpublish" : "Publish"}
          </button>
        </div>

        <div className="flex justify-between text-sm text-gray-500 mt-2">
          <p>Total Images:</p>
          <p>{singleEvent?.eventTotalImages}</p>
        </div>
      </div>

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

      <div className="space-y-4 p-4 bg-white border border-slate rounded-xl shadow-sm pb-28 sm:pb-4">
        <div>
          <p className="text-xs text-gray-500">Event Code:</p>
          <div className="flex justify-between items-center">
            <p className="font-semibold">{singleEvent?.eventCode}</p>
            <button className="text-primary text-xs hover:underline">
              Copy
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => navigate(`/${eventId}/clientview`)}
            className="flex-1 bg-slate hover:bg-primary-dark hover:text-white text-sm py-2.5 rounded-xl font-medium shadow-md transition"
          >
            Preview
          </button>
          <button className="flex-1 bg-slate text-gray-800 hover:text-white hover:bg-primary-dark text-sm py-2.5 rounded-xl font-medium shadow-sm transition">
            Insights
          </button>
        </div>

        <div className="border-t border-slate pt-3">
          <div className="flex justify-between items-center text-sm font-medium mb-2">
            <p>Sub-Events</p>
            <button className="text-primary text-xs hover:underline">
              + Add New
            </button>
          </div>

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

        <div className="grid grid-cols-1">
          <button
            onClick={() => navigate("/standyshow")}
            className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-medium text-sm py-2.5 rounded-lg transition shadow"
          >
            FaceScan Pre Registration
          </button>
        </div>
      </div>
    </aside>
  );
};

export default PersonalfolderAside;
