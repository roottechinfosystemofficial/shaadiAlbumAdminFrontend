import React from "react";
import PersonalfolderAside from "../component/PersonalfolderAside";

const PersonalFolder = () => {
  return (
    <>
      <aside className=" sm:w-1/5  sm:h-screen  px-2 py-6 ">
        <PersonalfolderAside />
      </aside>
      <div className="bg-red-200">
        
      </div>
    </>
  );
};

export default PersonalFolder;
