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
    <nav className="bg-white flex items-center justify-between px-6 pt-1 relative h-[70px]">
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
          <BiMenu size={24} />
        </button>

        {/* Navigation Links */}
        <div>
          <ul className={`${isMenuOpen ? "menu-open" : "menu-hidden"}`}>
            <li className="flex items-center gap-2 hover:text-primary-dark cursor-pointer transition-colors">
              <IoIosHome />
              <Link to="/" onClick={() => setIsMenuOpen(false)}>
                Dashboard
              </Link>
            </li>

            <li className="flex items-center gap-2 hover:text-primary-dark cursor-pointer transition-colors">
              <GrGallery />
              <Link to="/event" onClick={() => setIsMenuOpen(false)}>
                Client Gallery
              </Link>
            </li>

            <li className="flex items-center gap-2 hover:text-primary-dark cursor-pointer transition-colors">
              <FaUser />
              <Link to="/users" onClick={() => setIsMenuOpen(false)}>
                Users
              </Link>
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
              <li className="flex items-center gap-2 hover:text-primary-dark cursor-pointer transition-colors">
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
                  className="absolute z-10 flex-col right-[-30px] top-[41px] w-48 bg-white shadow-2xl rounded-md p-2"
                >
                  {[
                    ["Email", "/email"],
                    ["Pages", "/pages"],
                    ["Banners", "/banners"],
                    ["Showcase", "/showcase"],
                    ["Notifications", "/notifications"],
                    ["Face Recognition", "/face-recognition"],
                    ["History", "/history"],
                  ].map(([text, path], i) => (
                    <li
                      key={i}
                      className="p-2 hover:bg-primary/10 rounded-md cursor-pointer transition-all"
                    >
                      <Link to={path}>{text}</Link>
                    </li>
                  ))}
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

          {isProfileOpen && (
            <ul
              onMouseEnter={() => setIsProfileOpen(true)}
              onMouseLeave={() => setIsProfileOpen(false)}
              className="absolute z-10 right-[-20px] flex-col top-[52px] w-48 bg-white shadow-md rounded-md p-2"
            >
              <li className="p-2 hover:bg-primary/10 rounded-md transition-all">
                <Link to="/my-profile">My Profile</Link>
              </li>
              <Link to="/login">
                <li className="p-2 hover:bg-primary/10 rounded-md transition-all">
                  Logout
                </li>
              </Link>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
