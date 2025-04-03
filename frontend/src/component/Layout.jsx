import React from "react";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="relative flex-grow min-h-[567px]">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
