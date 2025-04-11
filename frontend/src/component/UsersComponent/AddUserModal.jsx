import React from "react";

const AddUserModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-[999]">
      <div className="w-[700px] bg-white rounded-md shadow-lg overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center px-4 py-3 border-b bg-slate text-gray-800">
          <h2 className="text-lg font-semibold">Add New User</h2>
          <button
            className="text-2xl font-bold text-slate-dark hover:text-black"
            onClick={onClose}
          >
            &times;
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="flex gap-5 mb-4">
            <div className="flex-1">
              <label className="block text-sm font-medium">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Full Name"
                className="w-full mt-1 p-2 border border-slate-dark rounded"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                placeholder="Email"
                className="w-full mt-1 p-2 border border-slate-dark rounded"
              />
            </div>
          </div>

          <div className="flex gap-5 mb-4">
            <div className="flex-1">
              <label className="block text-sm font-medium">
                Contact <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2 mt-1">
                <select className="w-1/3 p-2 border border-slate-dark rounded">
                  <option>+91</option>
                  <option>+1</option>
                </select>
                <input
                  type="text"
                  placeholder="Phone Number"
                  className="w-2/3 p-2 border border-slate-dark rounded"
                />
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                placeholder="Password"
                className="w-full mt-1 p-2 border border-slate-dark rounded"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium">User Image</label>
            <input type="file" className="mt-1" />
            <small className="text-red-500 text-xs">
              (Image max 512px × 512px)
            </small>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-4 py-3 border-t bg-slate/10">
          <button
            className="px-4 py-2 bg-slate text-gray-800 rounded hover:bg-slate-dark"
            onClick={onClose}
          >
            Close
          </button>
          <button className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark">
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddUserModal;
