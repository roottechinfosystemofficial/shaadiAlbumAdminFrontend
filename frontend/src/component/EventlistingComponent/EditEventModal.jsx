import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "../../utils/toast.js";
import { editEvent } from "../../utils/editEvents.util.js";

const EditEventModal = ({
  editForm,
  editingEvent,
  setEditForm,
  setEditingEvent,
  setOpenEditModel,
  setEvents,
}) => {
  const [hasChanges, setHasChanges] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const initialEditFormRef = useRef(null);
  const { accessToken } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (editForm && !initialEditFormRef.current) {
      initialEditFormRef.current = { ...editForm };
    }
  }, [editForm]);

  useEffect(() => {
    const initial = initialEditFormRef.current;
    const isChanged = Object.keys(editForm || {}).some(
      (key) => editForm[key] !== initial?.[key]
    );
    setHasChanges(isChanged);
  }, [editForm]);

  const handleEditFormChange = (field, value) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
    setFormErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await editEvent(
        editingEvent._id,
        editForm,
        dispatch,
        accessToken
      );

      if (res?.status === 200) {
        toast.success("Event updated successfully!");

        setEvents((prev) =>
          prev.map((event) =>
            event._id === editingEvent._id ? { ...event, ...editForm } : event
          )
        );

        setOpenEditModel(false);
      }
    } catch (error) {
      console.error("Edit failed:", error);

      if (error.response?.status === 400) {
        const message = error.response.data?.message || "";

        if (message.includes("code")) {
          setFormErrors({ eventCode: message });
        } else if (message.includes("password")) {
          setFormErrors({ eventPassword: message });
        } else {
          toast.error(message || "Failed to update event.");
        }
      } else {
        toast.error("Something went wrong.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 px-4 z-50">
      <div className="bg-white px-5 py-6 rounded-lg shadow-lg h-[560px] w-[95%] sm:w-[80%] md:w-[60%] lg:w-[40%] max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Edit Event</h2>
          <button
            className="text-gray-500 hover:text-gray-700 text-lg"
            onClick={() => {
              initialEditFormRef.current = null;
              setOpenEditModel(false);
              setFormErrors({});
            }}
          >
            ×
          </button>
        </div>
        <form onSubmit={handleEditSubmit}>
          {/* Event Name */}
          <label className="block text-gray-700 font-medium mb-1">
            Event Name *
          </label>
          <input
            type="text"
            value={editForm?.eventName || ""}
            onChange={(e) => handleEditFormChange("eventName", e.target.value)}
            className="w-full border p-2 rounded-md mb-3"
            required
          />

          {/* Event Date */}
          <label className="block text-gray-700 font-medium mb-1">
            Event Date
          </label>
          <input
            type="date"
            value={editForm?.eventDate || ""}
            onChange={(e) => handleEditFormChange("eventDate", e.target.value)}
            className="w-full border p-2 rounded-md mb-3"
          />

          {/* Event Delete Date */}
          <label className="block text-gray-700 font-medium mb-1">
            Event Delete Date
          </label>
          <input
            type="date"
            min={new Date().toISOString().split("T")[0]}
            value={editForm?.deleteDate || ""}
            onChange={(e) => handleEditFormChange("deleteDate", e.target.value)}
            className="w-full border p-2 rounded-md mb-3"
          />

          {/* Change Event ID */}
          <div className="flex items-center mb-2 gap-2">
            <input
              type="checkbox"
              checked={editForm?.showEditCode || false}
              onChange={() =>
                handleEditFormChange("showEditCode", !editForm?.showEditCode)
              }
              className="accent-blue-600 w-4 h-4"
              id="editCode"
            />
            <label
              htmlFor="editCode"
              className="text-gray-700 font-medium cursor-pointer"
            >
              Change Event ID
            </label>
          </div>

          {editForm?.showEditCode && (
            <>
              <input
                type="text"
                value={editForm?.eventCode || ""}
                onChange={(e) =>
                  handleEditFormChange("eventCode", e.target.value)
                }
                className="w-full border p-2 rounded-md mb-1"
              />
              {formErrors.eventCode && (
                <p className="text-red-600 text-sm mb-2">
                  {formErrors.eventCode}
                </p>
              )}
            </>
          )}

          {/* Change Event Password */}
          <div className="flex items-center mb-2 gap-2">
            <input
              type="checkbox"
              checked={editForm?.showEditPassword || false}
              onChange={() =>
                handleEditFormChange(
                  "showEditPassword",
                  !editForm?.showEditPassword
                )
              }
              className="accent-blue-600 w-4 h-4"
              id="editPassword"
            />
            <label
              htmlFor="editPassword"
              className="text-gray-700 font-medium cursor-pointer"
            >
              Change Password
            </label>
          </div>

          {editForm?.showEditPassword && (
            <>
              <input
                type="text"
                value={editForm?.eventPassword || ""}
                onChange={(e) =>
                  handleEditFormChange("eventPassword", e.target.value)
                }
                className="w-full border p-2 rounded-md mb-1"
              />
              {formErrors.eventPassword && (
                <p className="text-red-600 text-sm mb-2">
                  {formErrors.eventPassword}
                </p>
              )}
            </>
          )}

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              className="bg-muted px-4 py-2 rounded-md hover:bg-muted-dark"
              onClick={() => {
                initialEditFormRef.current = null;
                setOpenEditModel(false);
                setFormErrors({});
              }}
            >
              Cancel
            </button>

            <button
              type="submit"
              className={`${
                hasChanges && !isSubmitting
                  ? "bg-primary hover:bg-primary-dark"
                  : "bg-gray-300 cursor-not-allowed"
              } text-white px-4 py-2 rounded-md flex items-center gap-2`}
              disabled={!hasChanges || isSubmitting}
            >
              {isSubmitting && (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEventModal;
