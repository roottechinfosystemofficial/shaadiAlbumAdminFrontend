import React, { useState } from "react";
import EventCard from "../component/EventCard";
import { Link } from "react-router-dom";

const EventlistPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [editingEvent, setEditingEvent] = useState(null);

  const sampleEvents = [
    {
      id: 1,
      name: "Rahul weds Kavita",
      date: "2025-04-17",
      published: true,
      code: "EVT1234",
      password: "123456",
      image:
        "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 2,
      name: "Rahul",
      date: "Apr 17, 2025",
      image:
        "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=600&q=60",
      code: "VPXL8U",
      password: "mypassword",
      published: true,
    },
    {
      id: 3,
      name: "Annual Meetup",
      date: "May 22, 2025",
      image:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=60",
      code: "XHZP9T",
      password: "event123",
      published: false,
    },
  ];

  const handleAddEvent = (e) => {
    e.preventDefault();
    console.log("Event Name:", eventName);
    console.log("Event Date:", eventDate);
    setShowModal(false);
  };

  const handleEdit = (id) => {
    const event = sampleEvents.find((e) => e.id === id);
    setEditingEvent(event);
  };

  const handleDelete = (id) => {
    console.log("Delete event with id:", id);
  };

  return (
    <>
      <div className="max-w-6xl mx-auto mt-10 px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <p className="text-3xl text-center md:text-left">Event List</p>
          <div className="flex flex-col sm:flex-row items-center gap-3 mt-4 md:mt-0 w-full sm:w-auto">
            <Link to="/setting">
              <button className="bg-slate px-4 py-2 rounded-md transition hover:bg-slate-dark w-full sm:w-auto">
                Default Setting
              </button>
            </Link>
            <button
              className="bg-primary text-white px-4 py-2 rounded-md transition hover:bg-primary-dark w-full sm:w-auto"
              onClick={() => setShowModal(true)}
            >
              Add Event
            </button>
          </div>
        </div>
        <hr className="border-t-1 border-gray-300 mt-3 mb-6" />

        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {sampleEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </div>

      {showModal && (
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
      )}

      {editingEvent && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 px-4 z-50">
          <div className="bg-white px-5 py-6 rounded-lg shadow-lg w-[95%] sm:w-[80%] md:w-[60%] lg:w-[40%] max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Edit Event</h2>
              <button
                className="text-gray-500 hover:text-gray-700 text-lg"
                onClick={() => setEditingEvent(null)}
              >
                ×
              </button>
            </div>

            <form>
              <label className="block text-gray-700 font-medium mb-1">
                Event Name *
              </label>
              <input
                type="text"
                defaultValue={editingEvent.name}
                className="w-full border p-2 rounded-md mb-3"
              />

              <label className="block text-gray-700 font-medium mb-1">
                Event Date
              </label>
              <input
                type="date"
                defaultValue={editingEvent.date}
                className="w-full border p-2 rounded-md mb-3"
              />

              <label className="block text-gray-700 font-medium mb-1">
                Event Delete Date
              </label>
              <input
                type="date"
                className="w-full border p-2 rounded-md mb-3"
              />

              <label className="block text-gray-700 font-medium mb-1">
                Change Event ID
              </label>
              <input
                type="text"
                defaultValue={editingEvent.code}
                className="w-full border p-2 rounded-md mb-3"
              />

              <label className="block text-gray-700 font-medium mb-1">
                Change Password
              </label>
              <input
                type="text"
                defaultValue={editingEvent.password}
                className="w-full border p-2 rounded-md mb-4"
              />

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
                  className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default EventlistPage;
