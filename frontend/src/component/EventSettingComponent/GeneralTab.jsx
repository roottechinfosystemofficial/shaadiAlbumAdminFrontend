import React, { useState } from "react";
import { Eye, EyeOff, Info } from "lucide-react";

// Toggle switch component
const ToggleSwitch = ({ enabled, onToggle }) => (
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

  const toggleItems = [
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
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-white rounded-2xl shadow-lg text-gray-800">
      {/* Left Side */}
      <div className="space-y-6">
        {/* Name Field */}
        <div>
          <label className="block text-sm font-semibold mb-1">Name</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <button className="text-sm text-blue-600 hover:underline font-medium">
              Update
            </button>
          </div>
        </div>

        {/* Toggle Settings */}
        {toggleItems.map((item, i) => (
          <div
            key={i}
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
          {/* Event Date */}
          <div>
            <label className="block font-semibold mb-1">Event Date</label>
            <input
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Expiry Date */}
          <div>
            <label className="font-semibold mb-1 flex items-center gap-1">
              Expiry Date <Info size={14} className="text-gray-400" />
            </label>
            <input
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Password Protection */}
          <div className="col-span-full space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Password Protection</span>
              <ToggleSwitch
                enabled={passwordProtected}
                onToggle={() => setPasswordProtected(!passwordProtected)}
              />
            </div>

            {passwordProtected && (
              <div className="space-y-2 max-w-md">
                <p className="text-sm text-green-600 font-medium">
                  Password is enabled for this event
                </p>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full border px-3 py-2 pr-20 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute sm:right-[13%] right-[22%] top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                  {password && (
                    <button className="absolute right-2 top-1/2 -translate-y-1/2 font-bold text-blue-600 hover:underline">
                      Update
                    </button>
                  )}
                </div>
                <p className="text-xs text-gray-500 italic">
                  Password must be at least 6 characters and contain letters or
                  numbers
                </p>
              </div>
            )}
          </div>

          {/* Image Share */}
          <div className="flex justify-between items-center sm:col-span-1">
            <span className="font-semibold">Image Share</span>
            <ToggleSwitch
              enabled={imageShare}
              onToggle={() => setImageShare(!imageShare)}
            />
          </div>

          {/* Watermark Section */}
          <div className="col-span-full mt-2">
            <p className="font-semibold">Watermark</p>
            <p className="text-sm text-gray-700">
              Go to{" "}
              <span className="text-blue-600 font-medium underline cursor-pointer">
                General Settings
              </span>{" "}
              to edit watermark settings.
            </p>
            <p className="text-sm italic text-gray-500 mt-1">
              You do not have any watermarks
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralTab;
