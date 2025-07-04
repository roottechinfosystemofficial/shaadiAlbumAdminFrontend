import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import GeneralTab from "../component/EventSettingComponent/GeneralTab";
import GalleryLayoutTab from "../component/EventSettingComponent/GalleryLayoutTab";
import DownloadsTab from "../component/EventSettingComponent/DownloadsTab";
import SharingTab from "../component/EventSettingComponent/SharingTab";
import CoverImageTab from "../component/EventSettingComponent/CoverImageTab";
import AddSinglePhotoModal from "../component/Personalfoldercomponent/AddSinglePhotosModal";
import { useSelector } from "react-redux";

const tabs = [
  "General",
  "Cover Image",
  "Gallery layout",
  "Downloads",
  "Sharing",
];

const tabComponents = {
  General: GeneralTab,
  "Cover Image": CoverImageTab,
  "Gallery layout": GalleryLayoutTab,
  Downloads: DownloadsTab,
  Sharing: SharingTab,
};

const EventSetting = () => {
  const [activeTab, setActiveTab] = useState("General");
  const[isPopUpOpen,setIsPopUpOpen]=useState(false)
  const ActiveComponent = tabComponents[activeTab];
  const navigate = useNavigate();
  const location = useLocation();
  const eventId = location.state?.eventId;
  const { currentSubEvent, currentEventId } = useSelector(
    (state) => state.event
  );
  

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-6 border-b border-slate pb-4">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm text-primary font-medium px-3 py-1.5 border border-transparent rounded-md hover:border-primary hover:bg-slate transition-all"
        >
          <ArrowLeft size={18} />
          Back
        </button>
        <h2 className="text-xl font-semibold text-primary-dark">
          Event Setting
        </h2>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-3 border-b border-slate pb-3">
        {tabs.map((tab, idx) => (
          <button
            key={idx}
            onClick={() => setActiveTab(tab)}
            className={`text-sm px-4 py-2 rounded-full font-semibold transition-all ${
              activeTab === tab
                ? "bg-primary text-white "
                : "bg-slate text-primary-dark hover:bg-primary-dark hover:text-white"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      {
        activeTab==='Cover Image' &&
      
      (
        <div className="flex justify-center items-center">
          <button
            onClick={() => setIsPopUpOpen(true)}
            className="bg-primary hover:bg-primary-dark text-white text-sm font-medium px-4 py-2 rounded-md shadow transition"
          >
            + Upload
          </button>
          </div>
      )}

      {/* Active Tab Content */}
      <div>
        <ActiveComponent eventId={eventId} />
      </div>
      <AddSinglePhotoModal
      onUploadSuccess={()=>{}}
      currentSubEvent={currentSubEvent}
      hasUploadFromFolder={false}
      onClose={()=>{setIsPopUpOpen(false)}} 
      isOpen={isPopUpOpen}/>
    </div>
  );
};

export default EventSetting;
