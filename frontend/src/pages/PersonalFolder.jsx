import React from "react";
import PersonalfolderAside from "../component/PersonalfolderAside";
import PersonalFolderContent from "../component/PersonalFolderContent";

const PersonalFolder = () => {
  return (
    <div className="flex flex-col sm:flex-row min-h-screen">
      {/* Sidebar */}
      <aside className=" sm:w-[280px] w-full  border-r border-slate bg-white ">
        <PersonalfolderAside />
      </aside>

      {/* Main Content */}
      <main className="flex-1 w-full overflow-y-auto">
        <PersonalFolderContent />
      </main>
    </div>
  );
};

export default PersonalFolder;
