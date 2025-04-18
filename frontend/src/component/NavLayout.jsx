import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar"; // Assuming you have a Navbar component
import { useAuthCheck } from "../Hooks/useAuthCheckHook";

const NavLayout = () => {
  useAuthCheck();
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="relative flex-grow min-h-[567px]">
        <Outlet />
      </main>
    </div>
  );
};

export default NavLayout;
