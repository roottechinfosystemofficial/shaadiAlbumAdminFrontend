import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo_1.png";
import { IoIosHome, IoMdSettings } from "react-icons/io";
import { GrGallery } from "react-icons/gr";
import { FaAngleDown, FaUser } from "react-icons/fa";
import { BiMenu } from "react-icons/bi";
import "../css/Navbar.css";
import { useDispatch, useSelector } from "react-redux";
import toast from "../utils/toast.js";

import { logoutUser } from "../utils/logoutUser.js";
import { BiPurchaseTagAlt } from "react-icons/bi";
import { MdPayment } from "react-icons/md";



const Navbar = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { authUser } = useSelector((state) => state.user);
  const [prevAuthUser, setPrevAuthUser] = useState(null);
  const dispatch = useDispatch();
  const { accessToken } = useSelector((state) => state.user); // ✅ include refreshToken

  const navigate = useNavigate();
  useEffect(() => {
    if (prevAuthUser !== authUser) {
      setPrevAuthUser(authUser);
    }
  }, [authUser, prevAuthUser]);

  const changeSettingOpen = () => {
    setIsSettingsOpen(!isSettingsOpen);
    setIsProfileOpen(false);
  };

  const changeProfileOpen = () => {
    setIsProfileOpen(!isProfileOpen);
    setIsSettingsOpen(false);
  };

  const logoutHandler = async () => {
    try {
      await logoutUser({ accessToken, dispatch, navigate });
      toast.success("You have successfully logged out!");
    } catch (error) {
      toast.error("Logout failed. Please try again.");
      console.error("Logout error:", error);
    }
  };

  return (
    <nav className="bg-white flex items-center justify-between px-6 pt-3 relative h-[70px]">
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
            <Link to="/" onClick={() => setIsMenuOpen(false)}>
              <li className="flex items-center gap-2 hover:text-primary-dark cursor-pointer transition-colors">
                <IoIosHome />
                Dashboard
              </li>
            </Link>
            {
              authUser.trialFinished &&
            

            (<Link to="/" onClick={() => setIsMenuOpen(false)}>
              <li className="flex items-center gap-2 hover:text-primary-dark cursor-pointer transition-colors">
                <MdPayment size={20}/>
                Purchase Plan
              </li>
            </Link>)}

            <Link to="/event" onClick={() => setIsMenuOpen(false)}>
              <li className="flex items-center gap-2 hover:text-primary-dark cursor-pointer transition-colors">
                <GrGallery />
                Client Gallery
              </li>
            </Link>

            <Link to="/users" onClick={() => setIsMenuOpen(false)}>
              <li className="flex items-center gap-2 hover:text-primary-dark cursor-pointer transition-colors">
                <FaUser />
                Users
              </li>
            </Link>

            {/* Settings Dropdown */}
            <div className="relative">
              <li className="flex items-center justify-center gap-2 hover:text-primary-dark cursor-pointer transition-colors">
                <Link to="/setting" className="flex gap-2 items-center">
                  <IoMdSettings />
                  Settings
                </Link>
                <FaAngleDown onClick={changeSettingOpen} />
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
          onClick={changeProfileOpen}
        >
          <img
            src={authUser?.logo}
            alt="Avatar"
            className="w-10 h-10 rounded-full"
          />
          <span>Hi, {authUser?.name}</span>
          <FaAngleDown />

          {isProfileOpen && (
            <ul
              onMouseEnter={() => setIsProfileOpen(true)}
              onMouseLeave={() => setIsProfileOpen(false)}
              className="absolute z-10 right-[-20px] flex-col top-[52px] w-48 bg-white shadow-md rounded-md p-2"
            >
              <Link to="/myprofile">
                <li className="p-2 hover:bg-primary/10 rounded-md transition-all">
                  My Profile
                </li>
              </Link>

              <div className="cursor-pointer " onClick={logoutHandler}>
                <li className="p-2 hover:bg-primary/10 rounded-md transition-all">
                  Logout
                </li>
              </div>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
