import React, { useState, useEffect } from "react";

const EditEventModal = ({ editForm, setEditForm, setEditingEvent }) => {
  const [hasChanges, setHasChanges] = useState(false);

  // Track if the editForm is different from the initial one to enable/disable Save button
  useEffect(() => {
    const isFormChanged = Object.keys(editForm).some(
      (key) => editForm[key] !== initialEditForm[key]
    );
    setHasChanges(isFormChanged);
  }, [editForm]);

  const initialEditForm = { ...editForm }; // Keep a copy of the initial form state

  const handleEditFormChange = (field, value) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    console.log("Edited Event Details:", editForm);
    // Add API update logic here if needed
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 px-4 z-50">
      <div className="bg-white px-5 py-6 rounded-lg shadow-lg h-[560px] w-[95%] sm:w-[80%] md:w-[60%] lg:w-[40%] max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Edit Event</h2>
          <button
            className="text-gray-500 hover:text-gray-700 text-lg"
            onClick={() => setEditingEvent(null)}
          >
            ×
          </button>
        </div>
        <form onSubmit={handleEditSubmit}>
          <label className="block text-gray-700 font-medium mb-1">
            Event Name *
          </label>
          <input
            type="text"
            value={editForm.eventName}
            onChange={(e) => handleEditFormChange("eventName", e.target.value)}
            className="w-full border p-2 rounded-md mb-3"
          />
          <label className="block text-gray-700 font-medium mb-1">
            Event Date
          </label>
          <input
            type="date"
            value={editForm.eventDate}
            onChange={(e) => handleEditFormChange("eventDate", e.target.value)}
            className="w-full border p-2 rounded-md mb-3"
          />
          <label className="block text-gray-700 font-medium mb-1">
            Event Delete Date
          </label>
          <input
            type="date"
            min={new Date().toISOString().split("T")[0]}
            value={editForm.deleteDate}
            onChange={(e) => handleEditFormChange("deleteDate", e.target.value)}
            className="w-full border p-2 rounded-md mb-3"
          />

          <div className="flex items-center mb-2 gap-2">
            <input
              type="checkbox"
              checked={editForm.showEditCode}
              onChange={() =>
                handleEditFormChange("showEditCode", !editForm.showEditCode)
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
          {editForm.showEditCode && (
            <input
              type="text"
              value={editForm.eventCode}
              onChange={(e) =>
                handleEditFormChange("eventCode", e.target.value)
              }
              className="w-full border p-2 rounded-md mb-3"
            />
          )}

          <div className="flex items-center mb-2 gap-2">
            <input
              type="checkbox"
              checked={editForm.showEditPassword}
              onChange={() =>
                handleEditFormChange(
                  "showEditPassword",
                  !editForm.showEditPassword
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
          {editForm.showEditPassword && (
            <input
              type="text"
              value={editForm.eventPassword}
              onChange={(e) =>
                handleEditFormChange("eventPassword", e.target.value)
              }
              className="w-full border p-2 rounded-md mb-4"
            />
          )}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              className="bg-muted px-4 py-2 rounded-md hover:bg-muted-dark"
              onClick={() => setEditingEvent(null)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`${
                hasChanges ? "bg-primary" : "bg-primary cursor-not-allowed"
              } text-white px-4 py-2 rounded-md hover:bg-primary-dark`}
              disabled={!hasChanges}
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEventModal;
