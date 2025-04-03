import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo_1.png";
import profileImg from "../assets/download.jpg";
import { IoIosHome, IoMdSettings } from "react-icons/io";
import { GrGallery } from "react-icons/gr";
import { FaAngleDown, FaUser } from "react-icons/fa";
import { BiMenu } from "react-icons/bi";
import "../css/Navbar.css";

const Navbar = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const changeSettingOpen = () => {
    setIsSettingsOpen(!isSettingsOpen);
    setIsProfileOpen(false);
  };

  const changeProfileOpen = () => {
    setIsProfileOpen(!isProfileOpen);
    setIsSettingsOpen(false);
  };

  return (
    <nav className="bg-[#ededed] flex items-center justify-between px-6 pt-1 relative h-[70px]">
      {/* Logo */}
      <div className="mt-2">
        <Link to="/">
          <img src={logo} alt="Logo" width={100} />
        </Link>
      </div>

      <div className="flex items-center gap-10">
        <button
          onClick={() => {
            setIsMenuOpen(!isMenuOpen);
            setIsSettingsOpen(false);
            setIsProfileOpen(false);
          }}
          className="menu-button"
        >
          <BiMenu />
        </button>
        {/* Navigation Links */}
        <div>
          <ul className={`${isMenuOpen ? "menu-open" : "menu-hidden"}`}>
            <li className="flex items-center gap-2 hover:text-[#F36564] cursor-pointer">
              <IoIosHome />
              <Link to="/">Dashboard</Link>
            </li>

            <li className="flex items-center gap-2 hover:text-[#F36564] cursor-pointer">
              <GrGallery />
              <Link to="/event">Client Gallery</Link>
            </li>

            <li className="flex items-center gap-2 hover:text-[#F36564] cursor-pointer">
              <FaUser />
              <Link to="/users">Users</Link>
            </li>

            {/* Settings Dropdown */}
            <div
              className="relative"
              onClick={changeSettingOpen}
              onMouseEnter={() => {
                setIsSettingsOpen(true);
                setIsProfileOpen(false);
              }}
            >
              <li className="flex items-center gap-2 hover:text-[#F36564] cursor-pointer">
                <IoMdSettings />
                Settings
                <FaAngleDown />
              </li>

              {isSettingsOpen && (
                <ul
                  onMouseEnter={() => {
                    setIsSettingsOpen(true);
                    setIsProfileOpen(false);
                  }}
                  onMouseLeave={() => setIsSettingsOpen(false)}
                  className="absolute z-10 flex-col right-[-30px] top-[41px]  w-48 bg-white shadow-2xl rounded-md p-2"
                >
                  <li className="p-2 hover:bg-gray-200 rounded-md">
                    <Link to="/email">Email</Link>
                  </li>
                  <li className="p-2 hover:bg-gray-200 rounded-md">
                    <Link to="/pages">Pages</Link>
                  </li>
                  <li className="p-2 hover:bg-gray-200 rounded-md">
                    <Link to="/banners">Banners</Link>
                  </li>
                  <li className="p-2 hover:bg-gray-200 rounded-md">
                    <Link to="/showcase">Showcase</Link>
                  </li>
                  <li className="p-2 hover:bg-gray-200 rounded-md">
                    <Link to="/notifications">Notifications</Link>
                  </li>
                  <li className="p-2 hover:bg-gray-200 rounded-md">
                    <Link to="/face-recognition">Face Recognition</Link>
                  </li>
                  <li className="p-2 hover:bg-gray-200 rounded-md">
                    <Link to="/history">History</Link>
                  </li>
                </ul>
              )}
            </div>
          </ul>
        </div>

        {/* User Profile Dropdown */}
        <div
          className="relative flex items-center gap-2"
          onMouseEnter={() => {
            setIsProfileOpen(true);
            setIsSettingsOpen(false);
          }}
          onClick={changeProfileOpen}
        >
          <img
            src={profileImg}
            alt="Avatar"
            className="w-10 h-10 rounded-full"
          />
          <span>Hi, Your</span>
          <FaAngleDown />

          {/* Profile Submenu */}
          {isProfileOpen && (
            <ul
              onMouseEnter={() => setIsProfileOpen(true)}
              onMouseLeave={() => setIsProfileOpen(false)}
              className="absolute z-10 right-[-20px] flex-col top-[52px]  w-48 bg-white shadow-md rounded-md p-2"
            >
              <li className="p-2 hover:bg-gray-200 rounded-md">
                <Link to="/my-profile">My Profile</Link>
              </li>
              <li className="p-2 hover:bg-gray-200 rounded-md">
                <Link to="/logout">Logout</Link>
              </li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
