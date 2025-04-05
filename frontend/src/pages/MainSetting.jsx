import React from "react";

const MainSetting = () => {
  return (
    <div className="max-w-6xl mx-auto bg-white rounded-xl p-4">
      <h2 className="text-2xl font-bold mb-4">Settings</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6 shadow rounded-lg">
        <div>
          <label className="block font-medium mb-1">Business Name *</label>
          <input
            type="text"
            placeholder="Business Name"
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">
            Support Email Address *
          </label>
          <input
            type="email"
            placeholder="youremail@gmail.com"
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">
            Support Contact No. *
          </label>
          <input
            type="text"
            placeholder="9876543210"
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Office Address *</label>
          <input
            type="text"
            placeholder="Your Address"
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">
            MapLink - Contact Us Page
          </label>
          <input
            type="text"
            placeholder="Google Map Link"
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Logo Image</label>
          <input type="file" className="w-full p-2 border rounded" />
        </div>
        <div className="col-span-full flex justify-end mt-6">
          <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default MainSetting;
