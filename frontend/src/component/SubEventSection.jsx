import React, { useState } from "react";
import { Trash2 } from "lucide-react";
import { EVENT_API_END_POINT } from "../constant";
import apiRequest from "../utils/apiRequest";
import { useDispatch, useSelector } from "react-redux";
import { useGetSingleEvent } from "../Hooks/useGetSingleEvent";
import {
  setCurrentSubEvent,
  setCurrentSubEventId,
} from "../Redux/Slices/EventSlice";
import toast from "../utils/toast";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import LoaderModal from "./LoadingModal";
import ErrorModal from "./UsersComponent/ErrorModal";

const SubEventSection = ({ currentEvent, setIsLoading }) => {
  const [showInput, setShowInput] = useState(false);
  const [subEventName, setSubEventName] = useState("");
  const { accessToken } = useSelector((state) => state.user);

  const[err,setErr]=useState('')

  const[deleteLoader,setDeleteLoader]=useState(false)

  const [isOpen,setIsOpen]=useState(false)
  const dispatch = useDispatch();
  const { currentSubEvent, currentEventId } = useSelector(
    (state) => state.event
  );
  const { refetchEvent } = useGetSingleEvent(currentEventId);

  const handleCreateSubEvent = async () => {
    const cleanName = subEventName.trim();
    if (!cleanName) {
      toast.error("Sub-event name cannot be empty.");
      return;
    }

    try {
      setIsLoading?.(true);

      const endpoint = `${EVENT_API_END_POINT}/createSubEvent/${currentEvent?._id}`;
      const res = await apiRequest(
        "POST",
        endpoint,
        { subEventName: cleanName },
        accessToken,
        dispatch
      );

      if (accessToken && res.status === 201) {
        await refetchEvent();
        setSubEventName("");
        setShowInput(false);
        toast.success("Sub-event created successfully!");
      }
    } catch (error) {
      toast.error("Failed to create sub-event.");
      console.error("Create sub-event error:", error);
    } finally {
      setIsLoading?.(false);
    }
  };

  const handleSubEvent = (sub) => {
    console.log("sub info",sub)
    dispatch(setCurrentSubEvent(sub));
    dispatch(setCurrentSubEventId(sub._id));
  };

  // Determine if the sub-event is selected
  const isSelected = (subEvent) => currentSubEvent?._id === subEvent?._id;

  // Log sub-event ID when trash button is clicked
  const handleDeleteSubEvent = (subEventId) => {
    console.log("Sub-event ID to be deleted:", subEventId);
    setIsOpen(true)
    // You can also make an API call to delete the sub-event if required
  };

  const onCancel=()=>{
    setIsOpen(false)

  }

  const onConfirm=async()=>{
    setDeleteLoader(true)
    setErr('')

    try{

      const res=await apiRequest("DELETE",`${EVENT_API_END_POINT}/delete-subevent?eventId=${currentEvent?._id}&subEventId=${currentSubEvent?._id}`
)     
       toast.success("SubEvent Deleted SuccessFully")
      setDeleteLoader(false)
          setErr('')


    }
    catch(err){
            setDeleteLoader(false)
            setErr(err?.response?.data?.message ?? "Something Went Wrong!!!")


    }
    finally{
      setIsOpen(false)
      setDeleteLoader(false)
    }

  }

  return (
    <div className="border-t border-slate pt-3">
      <div className="flex justify-between items-center text-sm font-medium mb-2">
        <p>Sub-Events</p>
        <button
          className="text-primary text-xs hover:underline"
          onClick={() => setShowInput(!showInput)}
        >
          + Add New
        </button>
      </div>

      {showInput && (
        <div className="flex items-center gap-2 mb-4">
          <input
            type="text"
            value={subEventName}
            onChange={(e) => setSubEventName(e.target.value)}
            placeholder="Enter sub-event name"
            className="flex-1 px-3 py-2 border rounded-md text-sm"
          />
          <button
            onClick={handleCreateSubEvent}
            className="bg-primary hover:bg-primary-dark text-white text-sm px-4 py-2 rounded-md"
          >
            Create
          </button>
        </div>
      )}

      {currentEvent?.subevents?.length > 0 ? (
        currentEvent.subevents.map((sub, index) => (
          <div
            onClick={() => handleSubEvent(sub)}
            key={index}
            className={`flex cursor-pointer justify-between items-center border border-slate rounded-lg px-3 py-2 shadow-sm mb-3 transition-all duration-200 ease-in-out ${
              isSelected(sub)
                ? "bg-primary text-white"
                : "hover:bg-slate hover:text-black"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-yellow-500">✨</span>
              <p className="font-medium">{sub.subEventName}</p>
              <span className="text-xs bg-white px-2 py-0.5 rounded-full text-gray-700 border border-slate">
                {sub.subEventTotalImages || 0}
              </span>
            </div>

            {/* Trash Button */}
            <div className="flex items-center ml-2">
              <button
                className="p-2 rounded-full text-red-600 hover:bg-red-100 hover:scale-105 transition-all duration-200"
                onClick={() => handleDeleteSubEvent(sub._id)} // Log sub-event ID on click
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))
      ) : (
        <p className="text-sm text-gray-500 mt-2">No sub-events yet.</p>
      )}
      <LoaderModal message="Deleting Subevent ..." isOpen={deleteLoader}/>
      <ErrorModal onClose={()=>{setErr('')}} message={err} isOpen={err!=''}/>
      <ConfirmDeleteModal title="SubEvent" onConfirm={onConfirm} eventName={currentSubEvent?.subEventName} onCancel={onCancel}   isOpen={isOpen}/>
    </div>
  );
};

export default SubEventSection;
