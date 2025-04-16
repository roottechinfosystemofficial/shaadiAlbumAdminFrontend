import React from "react";

const EventModal = ({
  eventName,
  setEventName,
  eventDate,
  setEventDate,
  handleAddEvent,
  setShowModal,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 px-4 z-50">
      <div className="bg-white px-5 py-6 rounded-lg shadow-lg w-[95%] sm:w-[80%] md:w-[60%] lg:w-[40%] max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">ADD NEW EVENT</h2>
          <button
            className="text-gray-500 hover:text-gray-700 text-lg"
            onClick={() => setShowModal(false)}
          >
            ×
          </button>
        </div>
        <form onSubmit={handleAddEvent}>
          <label className="block text-gray-700 font-medium mb-1">
            Give your event a name *
          </label>
          <input
            type="text"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            placeholder="e.g. Rahul weds Kavita"
            className="w-full border p-2 rounded-md mb-3"
            required
          />
          <label className="block text-gray-700 font-medium mb-1">
            Event Date
          </label>
          <input
            type="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            className="w-full border p-2 rounded-md mb-4"
            required
          />
          <div className="flex flex-col sm:flex-row justify-end gap-3">
            <button
              type="button"
              className="bg-muted px-4 py-2 rounded-md hover:bg-muted-dark w-full sm:w-auto"
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
            <button
              type="submit"
              className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark w-full sm:w-auto"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventModal;
