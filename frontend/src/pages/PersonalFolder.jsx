import React from "react";
import PersonalfolderAside from "../component/PersonalfolderAside";
import PersonalFolderContent from "../component/PersonalFolderContent";
import { useGetSingleEvent } from "../Hooks/useGetSingleEvent";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const PersonalFolder = () => {
  const { eventId } = useParams();

  useGetSingleEvent(eventId);
  const { singleEvent } = useSelector((state) => state.event);
  return (
    <div className="flex flex-col sm:flex-row min-h-screen">
      {/* Sidebar */}
      <aside className=" sm:w-[280px] w-full  border-r border-slate bg-white ">
        <PersonalfolderAside singleEvent={singleEvent} />
      </aside>

      {/* Main Content */}
      <main className="flex-1 w-full overflow-y-auto">
        <PersonalFolderContent singleEvent={singleEvent} />
      </main>
    </div>
  );
};

export default PersonalFolder;
