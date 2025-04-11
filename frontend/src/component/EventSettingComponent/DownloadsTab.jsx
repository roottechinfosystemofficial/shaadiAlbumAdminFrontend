import React, { useState } from "react";
import { FiDownload, FiLock, FiSettings } from "react-icons/fi";

const DownloadsTab = () => {
  const [singleImageDownload, setSingleImageDownload] = useState(false);
  const [bulkImageDownload, setBulkImageDownload] = useState(false);
  const [restrictSubEvents, setRestrictSubEvents] = useState(false);
  const [emailBlockList, setEmailBlockList] = useState([]);
  const [blockedEmail, setBlockedEmail] = useState("");
  const [isAdvancedOptionsOpen, setIsAdvancedOptionsOpen] = useState(false);

  const handleBlockEmail = () => {
    if (blockedEmail) {
      setEmailBlockList([...emailBlockList, blockedEmail]);
      setBlockedEmail("");
    }
  };

  return (
    <div className="p-6 space-y-8">
      <h2 className="text-3xl font-bold text-gray-800">Download Settings</h2>

      {/* Download Settings Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Single Image Download */}
        <div className="bg-white p-6 rounded-xl shadow-md space-y-4">
          <div className="flex items-center space-x-3">
            <FiDownload className="text-2xl text-primary" />
            <h3 className="text-xl font-semibold text-gray-800">
              Single Image Download
            </h3>
          </div>
          <p className="text-sm text-gray-600">
            Allow your clients to download single photos from this event.
          </p>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-700">
              Enable Single Image Download
            </span>
            {/* Toggle Switch */}
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={singleImageDownload}
                onChange={() => setSingleImageDownload(!singleImageDownload)}
                className="sr-only"
              />
              <div
                className={`w-11 h-6 rounded-full transition-colors duration-300 ${
                  singleImageDownload ? "bg-green-600" : "bg-black"
                }`}
              ></div>
              <div
                className={`w-4 h-4 bg-white rounded-full absolute left-1 top-1 transition-all duration-300 ${
                  singleImageDownload ? "translate-x-5" : ""
                }`}
              ></div>
            </label>
          </div>
          {/* Download Sizes */}
          <div className="mt-4 space-y-2">
            <p className="font-medium text-gray-800">Download Sizes</p>
            <div className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="1600px"
                  name="size"
                  className="form-radio text-primary h-5 w-5"
                />
                <label htmlFor="1600px" className="text-sm text-gray-700">
                  1600 px
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="original"
                  name="size"
                  className="form-radio text-primary h-5 w-5"
                />
                <label htmlFor="original" className="text-sm text-gray-700">
                  Original
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Bulk Image Download */}
        <div className="bg-white p-6 rounded-xl shadow-md space-y-4">
          <div className="flex items-center space-x-3">
            <FiDownload className="text-2xl text-primary" />
            <h3 className="text-xl font-semibold text-gray-800">
              Bulk Image Download
            </h3>
          </div>
          <p className="text-sm text-gray-600">
            Allow your clients to download all galleries from this event.
          </p>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-700">
              Enable Bulk Image Download
            </span>
            {/* Toggle Switch */}
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={bulkImageDownload}
                onChange={() => setBulkImageDownload(!bulkImageDownload)}
                className="sr-only"
              />
              <div
                className={`w-11 h-6 rounded-full transition-colors duration-300 ${
                  bulkImageDownload ? "bg-green-600" : "bg-black"
                }`}
              ></div>
              <div
                className={`w-4 h-4 bg-white rounded-full absolute left-1 top-1 transition-all duration-300 ${
                  bulkImageDownload ? "translate-x-5" : ""
                }`}
              ></div>
            </label>
          </div>
          {/* Download Sizes */}
          <div className="mt-4 space-y-2">
            <p className="font-medium text-gray-800">Download Sizes</p>
            <div className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="1600px-bulk"
                  name="bulk-size"
                  className="form-radio text-primary h-5 w-5"
                />
                <label htmlFor="1600px-bulk" className="text-sm text-gray-700">
                  1600 px
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="original-bulk"
                  name="bulk-size"
                  className="form-radio text-primary h-5 w-5"
                />
                <label
                  htmlFor="original-bulk"
                  className="text-sm text-gray-700"
                >
                  Original
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="both"
                  name="bulk-size"
                  className="form-radio text-primary h-5 w-5"
                />
                <label htmlFor="both" className="text-sm text-gray-700">
                  Both
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Options Section */}
      <div className="bg-white p-6 rounded-xl shadow-md space-y-4">
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setIsAdvancedOptionsOpen(!isAdvancedOptionsOpen)}
        >
          <div className="flex items-center space-x-3">
            <FiSettings className="text-2xl text-primary" />
            <h3 className="text-xl font-semibold text-gray-800">
              Advanced Options
            </h3>
          </div>
          <span
            className={`text-gray-600 transform ${
              isAdvancedOptionsOpen ? "rotate-180" : "rotate-0"
            } transition-transform`}
          >
            &#9662;
          </span>
        </div>
        {isAdvancedOptionsOpen && (
          <div className="space-y-4 mt-4">
            {/* Block Specific Emails */}
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Block specific emails from downloading and prevent sub-events
                from being downloaded.
              </p>
              <div className="flex space-x-2 ">
                <input
                  type="email"
                  placeholder="Enter email"
                  value={blockedEmail}
                  onChange={(e) => setBlockedEmail(e.target.value)}
                  className="p-2 border border-gray-300 rounded-lg w-[70%]"
                />
                <button
                  onClick={handleBlockEmail}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition"
                >
                  Update
                </button>
              </div>
              <div>
                <p className="font-medium text-gray-800">
                  Blocked Email Addresses
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  {emailBlockList.map((email, index) => (
                    <li key={index} className="text-sm text-gray-600">
                      {email}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Restrict Download for Sub-Event Folders */}
            <div className="space-y-2">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">
                  Restrict Download for Sub-Event Folders
                </span>
                {/* Toggle Switch */}
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={restrictSubEvents}
                    onChange={() => setRestrictSubEvents(!restrictSubEvents)}
                    className="sr-only"
                  />
                  <div
                    className={`w-11 h-6 rounded-full transition-colors duration-300 ${
                      restrictSubEvents ? "bg-green-600" : "bg-black"
                    }`}
                  ></div>
                  <div
                    className={`w-4 h-4 bg-white rounded-full absolute left-1 top-1 transition-all duration-300 ${
                      restrictSubEvents ? "translate-x-5" : ""
                    }`}
                  ></div>
                </label>
              </div>
              <p className="text-sm text-gray-600">
                Enable to restrict download for specific sub-event folders in
                the collection. This applies to both Bulk and Single Photo
                Download.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DownloadsTab;
