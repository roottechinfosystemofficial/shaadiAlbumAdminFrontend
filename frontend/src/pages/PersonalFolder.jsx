import React from "react";
import PersonalfolderAside from "../component/PersonalfolderAside";
import PersonalFolderContent from "../component/PersonalFolderContent";
const PersonalFolder = () => {
  return (
    <div className="flex flex-col sm:flex-row h-full min-h-screen">
      <aside className="sm:w-1/5 w-full sm:h-screen border-r">
        <PersonalfolderAside />
      </aside>
      <PersonalFolderContent />
    </div>
  );
};

export default PersonalFolder;
