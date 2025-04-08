import React, { useState } from "react";
import { FiCopy } from "react-icons/fi";

const SharingTab = () => {
  const [copied, setCopied] = useState("");

  const handleCopy = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied(text);
        setTimeout(() => setCopied(""), 2000); // Reset the "copied" state after 2 seconds
      })
      .catch((err) => console.error("Failed to copy: ", err));
  };

  return (
    <div className="p-6 space-y-8">
      <h2 className="text-3xl font-bold text-gray-800">
        Direct Links to Share with Client
      </h2>

      {/* Face Only Link */}
      <div className="bg-white p-6 rounded-xl shadow-md ">
        <div className="w-full flex items-center justify-between">
          <p className="text-lg text-gray-700">Face Only</p>
          <div className="flex items-center  w-[80%]">
            <input
              type="text"
              value="https://shaadialbum.in/face-link/YTVZM042MGRTZy9meUlncENWWGVmdz09"
              readOnly
              className="p-2 border border-gray-300 rounded-md text-gray-600 w-full"
            />
            <button
              onClick={() =>
                handleCopy(
                  "https://shaadialbum.in/face-link/YTVZM042MGRTZy9meUlncENWWGVmdz09"
                )
              }
              className="px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              <FiCopy className="text-white" />
            </button>
          </div>
        </div>
        {copied ===
          "https://shaadialbum.in/face-link/YTVZM042MGRTZy9meUlncENWWGVmdz09" && (
          <p className="text-sm text-green-600 mt-2">
            Link copied to clipboard!
          </p>
        )}
      </div>

      {/* All Folders Link */}
      <div className="bg-white p-6 rounded-xl shadow-md ">
        <div className="w-full flex items-center justify-between">
          <p className="text-lg text-gray-700">All Folders</p>
          <div className="flex items-center   w-[80%]">
            <input
              type="text"
              value="https://shaadialbum.in/my-shared-event/YTVZM042MGRTZy9meUlncENWWGVmdz09"
              readOnly
              className="p-2 border border-gray-300 rounded-md text-gray-600 w-full"
            />
            <button
              onClick={() =>
                handleCopy(
                  "https://shaadialbum.in/my-shared-event/YTVZM042MGRTZy9meUlncENWWGVmdz09"
                )
              }
              className="px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              <FiCopy className="text-white" />
            </button>
          </div>
        </div>
        {copied ===
          "https://shaadialbum.in/my-shared-event/YTVZM042MGRTZy9meUlncENWWGVmdz09" && (
          <p className="text-sm text-green-600 mt-2">
            Link copied to clipboard!
          </p>
        )}
      </div>

      {/* Custom Domain Info */}
      <p className="text-sm text-gray-600 mt-6">
        Share this unique URL for this collection with your client. You can also
        use your custom domain if it's enabled.
      </p>
    </div>
  );
};

export default SharingTab;
