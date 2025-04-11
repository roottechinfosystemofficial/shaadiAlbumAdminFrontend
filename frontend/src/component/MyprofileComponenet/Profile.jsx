import { useState } from "react";
import MyprofilePass from "./MyprofilePass";
import MeProfile from "./MeProfile";

// Add User Component
const AddUser = () => (
  <div>
    <h3 className="text-xl font-bold mb-2">Add User</h3>
    <p>This is the Add User component content.</p>
  </div>
);

// Settings Component
const Settings = () => (
  <div>
    <h3 className="text-xl font-bold mb-2">Settings</h3>
    <p>This is the Settings component content.</p>
  </div>
);

// Main Profile Component
const Profile = () => {
  const [activeComponent, setActiveComponent] = useState("Profile");

  return (
    <div className="flex h-full">
      {/* Left Side */}
      <div className="w-[30%] bg-gray-100 flex flex-col items-center p-4 shadow-md rounded-l-2xl">
        <img
          src="https://via.placeholder.com/150"
          alt="Profile"
          className="w-40 h-40 object-cover rounded-full border-4 border-red-500 mb-4"
        />
        <h1 className="text-2xl font-bold">Your Name</h1>
      </div>

      {/* Right Side */}
      <div className="w-[70%] bg-white p-6 shadow-md rounded-r-2xl">
        {/* Header with Buttons */}
        <div className="flex items-center justify-between mb-6 border-b-2 border-primary/10 pb-5">
          <div className="space-x-2">
            <button
              onClick={() => setActiveComponent("Profile")}
              className={`px-4 py-2 rounded-xl shadow transition ${
                activeComponent === "Profile"
                  ? "bg-primary text-white"
                  : "bg-primary/10 text-primary hover:bg-primary/20"
              }`}
            >
              Profile Detail
            </button>
            <button
              onClick={() => setActiveComponent("Password")}
              className={`px-4 py-2 rounded-xl shadow transition ${
                activeComponent === "Password"
                  ? "bg-gray-700 text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              Password Settings
            </button>
          </div>
        </div>

        {/* Conditional Component Rendering */}
        {activeComponent === "Profile" && <MeProfile />}
        {activeComponent === "Password" && <MyprofilePass />}
      </div>
    </div>
  );
};

export default Profile;
