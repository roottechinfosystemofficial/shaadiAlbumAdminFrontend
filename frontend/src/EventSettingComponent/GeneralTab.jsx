import React, { useState } from "react";
import { Eye, EyeOff, Info } from "lucide-react";

// Toggle switch component
const ToggleSwitch = ({ enabled, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
        enabled ? "bg-green-500" : "bg-gray-300"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
          enabled ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
};

const GeneralTab = () => {
  const [name, setName] = useState("Rahuk");
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [socialEnabled, setSocialEnabled] = useState(true);
  const [printStore, setPrintStore] = useState(true);
  const [mobileField, setMobileField] = useState(true);
  const [guestUpload, setGuestUpload] = useState(true);
  const [eventDate, setEventDate] = useState("2025-04-01");
  const [expiryDate, setExpiryDate] = useState("2025-12-31");
  const [passwordProtected, setPasswordProtected] = useState(false);
  const [imageShare, setImageShare] = useState(true);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-4 text-gray-800 bg-white rounded-xl shadow-md">
      {/* Left Side */}
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Name
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <button className="text-sm text-blue-600 hover:underline font-medium">
              Update
            </button>
          </div>
        </div>

        {[
          {
            label: "Email Registration",
            state: emailEnabled,
            toggle: setEmailEnabled,
          },
          {
            label: "Social Sharing Buttons",
            state: socialEnabled,
            toggle: setSocialEnabled,
          },
          { label: "Print Store", state: printStore, toggle: setPrintStore },
          { label: "Mobile Field", state: mobileField, toggle: setMobileField },
          { label: "Guest Upload", state: guestUpload, toggle: setGuestUpload },
        ].map((item, index) => (
          <div
            key={index}
            className="flex justify-between items-center text-sm font-medium"
          >
            <span>{item.label}</span>
            <ToggleSwitch
              enabled={item.state}
              onToggle={() => item.toggle(!item.state)}
            />
          </div>
        ))}
      </div>

      {/* Right Side */}
      <div className="md:col-span-2 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
          <div>
            <label className="block font-semibold mb-1">Event Date</label>
            <input
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className=" font-semibold mb-1 flex items-center gap-1">
              Expiry Date <Info size={14} className="text-gray-400" />
            </label>
            <input
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Password Protection */}
          <div className=" space-y-3 ">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Password Protection</span>
              <ToggleSwitch
                enabled={passwordProtected}
                onToggle={() => setPasswordProtected(!passwordProtected)}
              />
            </div>

            {passwordProtected && (
              <div className="space-y-2 ">
                <p className="text-sm text-green-600 font-medium">
                  Password is enabled for this event
                </p>

                <div className="relative  max-w-sm">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full border border-gray-300 px-3 py-2 pr-10 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                  {password && (
                    <button className="absolute  right-[10%] top-1/2 -translate-y-1/2 font-bold text-blue-600 hover:text-blue-90000 hover:underline">
                      Update
                    </button>
                  )}
                </div>

                <p className="text-xs text-gray-500 italic">
                  This password needs to be letters or numbers with a minimum of
                  6 characters
                </p>
              </div>
            )}
          </div>

          {/* Image Share */}
          <div className="flex justify-between   sm:col-span-1">
            <span className="font-semibold">Image Share</span>
            <ToggleSwitch
              enabled={imageShare}
              onToggle={() => setImageShare(!imageShare)}
            />
          </div>

          {/* Watermark Section */}
          <div className="col-span-full mt-4">
            <p className="font-semibold">Watermark</p>
            <p className="text-sm text-gray-700">
              Go to
              <span className="font-medium text-blue-600 underline cursor-pointer">
                General Settings
              </span>{" "}
              to edit watermark settings.
            </p>
            <p className="text-gray-500 italic text-sm mt-1">
              You do not have any watermarks
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralTab;
