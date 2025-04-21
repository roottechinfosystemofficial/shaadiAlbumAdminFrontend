import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { EVENT_API_END_POINT } from "../constant";
import EventCard from "../component/EventlistingComponent/EventCard";
import EditEventModal from "../component/EventlistingComponent/EditEventModal";
import EventModal from "../component/EventlistingComponent/EventModal";
import { useDispatch, useSelector } from "react-redux";
import apiRequest from "../utils/apiRequest";
import { useGetSingleEvent } from "../Hooks/useGetSingleEvent";

const EventlistPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [editingEvent, setEditingEvent] = useState(null);
  const [events, setEvents] = useState([]);
  const { accessToken } = useSelector((state) => state.user);
  const [useEvenetId, setUseEventId] = useState();
  const dispatch = useDispatch();

  const [editForm, setEditForm] = useState({
    eventName: "",
    eventDate: "",
    deleteDate: "",
    eventCode: "",
    eventPassword: "",
  });

  const getAllEventsOfUser = async () => {
    try {
      const endpoint = `${EVENT_API_END_POINT}/getAllEventsOfUser`;
      const res = await apiRequest("GET", endpoint, {}, accessToken, dispatch); // ✅ pass dispatch
      if (res.status === 200) setEvents(res.data.data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  useEffect(() => {
    getAllEventsOfUser();
  }, []);

  const handleAddEvent = async (e) => {
    e.preventDefault();
    const eventDetails = { eventName, eventDate };
    try {
      const endpoint = `${EVENT_API_END_POINT}/createEvent`;
      const res = await apiRequest(
        "POST",
        endpoint,
        eventDetails,
        accessToken,
        dispatch
      ); // ✅ pass dispatch
      if (res.status === 200) getAllEventsOfUser();
    } catch (error) {
      console.error("Error adding event:", error);
    }

    setShowModal(false);
  };

  useGetSingleEvent(useEvenetId);
  //make this using hook
  const fetchEvent = async (eventId) => {
    try {
      const endpoint = `${EVENT_API_END_POINT}/getEventById/${eventId}`;
      const res = await apiRequest("GET", endpoint, {}, accessToken, dispatch); // ✅ pass dispatch
      if (res.status === 200) {
        const data = res.data.data;
        setEditingEvent(data);
        setEditForm({
          eventName: data.eventName || "",
          eventDate: data.eventDate?.substring(0, 10) || "",
          deleteDate: data.eventDeleteDate?.substring(0, 10) || "",
          eventCode: data.eventCode || "",
          eventPassword: data.eventPassword || "",
        });
      }
    } catch (err) {
      console.error("Error fetching event:", err);
    }
  };
  const handleEdit = (id) => {
    setUseEventId(id);
    fetchEvent(id);
  };

  const handleDelete = (id) => {
    console.log("Delete event with id:", id);
  };

  return (
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

      {events?.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-8">
          <p className="text-xl font-semibold text-gray-600 mb-2">
            No events available.
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Start by adding your first event!
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark"
          >
            Add Event
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {events.map((event) => (
            <EventCard
              key={event._id}
              event={event}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Add Event Modal */}
      {showModal && (
        <EventModal
          eventName={eventName}
          setEventName={setEventName}
          eventDate={eventDate}
          setEventDate={setEventDate}
          handleAddEvent={handleAddEvent}
          setShowModal={setShowModal}
        />
      )}

      {/* Edit Event Modal */}
      {editingEvent && (
        <EditEventModal
          editingEvent={editingEvent}
          setEditingEvent={setEditingEvent}
          editForm={editForm}
          setEditForm={setEditForm}
        />
      )}
    </div>
  );
};

export default EventlistPage;
