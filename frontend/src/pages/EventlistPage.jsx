import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { EVENT_API_END_POINT } from "../constant";
import EventCard from "../component/EventlistingComponent/EventCard";
import EditEventModal from "../component/EventlistingComponent/EditEventModal";
import EventModal from "../component/EventlistingComponent/EventModal";
import apiRequest from "../utils/apiRequest";
import toast from "../utils/toast.js";
import boximg from "../assets/box1.png";

import { setCurrentEvent, setCurrentEventId, setCurrentSubEvent } from "../Redux/Slices/EventSlice.jsx";
import LoaderModal from "../component/LoadingModal.jsx";

const EventlistPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [editingEvent, setEditingEvent] = useState(null);
  const [events, setEvents] = useState([]);
  const [useEventId, setUseEventId] = useState();
  const [openEditModel, setOpenEditModel] = useState(false);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const dispatch = useDispatch();
  const { accessToken } = useSelector((state) => state.user);
  const { currentEvent } = useSelector((state) => state.event);

  const [editForm, setEditForm] = useState({
    eventName: "",
    eventDate: "",
    deleteDate: "",
    eventCode: "",
    eventPassword: "",
  });

  const getAllEventsOfUser = async () => {
    setLoading(true);
    try {
      const endpoint = `${EVENT_API_END_POINT}/getAllEventsOfUser`;
      const res = await apiRequest("GET", endpoint, {}, accessToken, dispatch);
      if (res?.status === 200) {
        setEvents(res?.data?.data || []);
      }
    } catch (error) {
      toast.error("Failed to fetch events.");
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (accessToken) {
      getAllEventsOfUser();
    }
  }, [accessToken]);

  const handleAddEvent = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const endpoint = `${EVENT_API_END_POINT}/createEvent`;
      const res = await apiRequest(
        "POST",
        endpoint,
        { eventName, eventDate },
        accessToken,
        dispatch
      );
      if (res?.status === 200) {
        toast.success("Event added successfully!");
        await getAllEventsOfUser();
        setShowModal(false);
        setEventName("");
        setEventDate("");
        dispatch(setCurrentEvent(res.data.data))
        dispatch(setCurrentSubEvent(res.data.data.subEvents[res.data.data.subEvents?.length-1]))
      }
    } catch (error) {
      toast.error("Error adding event.");
      console.error("Error adding event:", error);
    } finally {
      setCreating(false);
    }
  };

  useEffect(() => {
    if (currentEvent?._id === useEventId) {
      setEditingEvent(currentEvent);
      setEditForm({
        eventName: currentEvent?.eventName || "",
        eventDate: currentEvent?.eventDate?.substring(0, 10) || "",
        deleteDate: currentEvent?.eventDeleteDate?.substring(0, 10) || "",
        eventCode: currentEvent?.eventCode || "",
        eventPassword: currentEvent?.eventPassword || "",
      });
    }
  }, [currentEvent, useEventId]);

  const handleEdit = (id) => {
    setUseEventId(id);
    dispatch(setCurrentEventId(id));
  };

  const handleDelete = (id) => {
    toast.info(`Delete event with id: ${id}`);
    // Implement actual delete logic here if needed
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 px-4">
      {/* Header */}
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

      {/* Content States */}
      {loading ? 
      (
        <LoaderModal isOpen={loading}/>
        // <div className="text-center py-10">
        //   <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2" />
        //   <p className="text-gray-600">Loading events...</p>
        // </div>
      ) : events?.length === 0 ? (
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
              setOpenEditModel={setOpenEditModel}
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
          loading={creating}
        />
      )}

      {/* Edit Event Modal */}
      {openEditModel && (
        <EditEventModal
          editingEvent={editingEvent}
          setEditingEvent={setEditingEvent}
          editForm={editForm}
          setEditForm={setEditForm}
          setOpenEditModel={setOpenEditModel}
          setEvents={setEvents}
        />
      )}
    </div>
  );
};

export default EventlistPage;
