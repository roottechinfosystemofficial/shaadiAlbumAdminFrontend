import React from "react";

const EditUserModal = ({ user, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-[999]">
      <div className="w-[750px] bg-white rounded-lg shadow-xl animate-fadeIn overflow-hidden">
        <div className="flex justify-between items-center px-4 py-3 border-b bg-gray-100">
          <h2 className="text-lg font-semibold">Edit user</h2>
          <button
            className="text-2xl font-bold text-gray-600 hover:text-black"
            onClick={onClose}
          >
            &times;
          </button>
        </div>
        <div className="p-6">
          <form className="grid grid-cols-2 gap-y-5 gap-x-8 text-sm">
            <div className="flex flex-col">
              <label className="font-medium mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                defaultValue={user.name}
                className="px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="flex flex-col">
              <label className="font-medium mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                defaultValue={user.email}
                className="px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="flex flex-col col-span-2">
              <label className="font-medium mb-1">
                Contact <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-3">
                <select
                  defaultValue="+91"
                  className="px-3 py-2 border border-gray-300 rounded-md w-24"
                >
                  <option value="+91">+91</option>
                  <option value="+1">+1</option>
                </select>
                <input
                  type="text"
                  defaultValue={user.phone?.split("-")[1]}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
            <div className="flex flex-col">
              <label className="font-medium mb-1">User Image</label>
              <input
                type="file"
                className="px-3 py-2 border border-gray-300 rounded-md"
              />
              <small className="text-red-500 text-xs mt-1">
                (Image max(512px*512px))
              </small>
              <img
                src="https://via.placeholder.com/60"
                alt="user"
                className="w-15 h-15 rounded-full object-cover mt-3 border border-gray-300"
              />
            </div>
            <div className="col-span-2 flex items-center gap-3 mt-1 text-sm">
              <input type="checkbox" id="changePass" className="w-4 h-4" />
              <label htmlFor="changePass" className="cursor-pointer">
                Change Password
              </label>
            </div>
            <div className="col-span-2 flex justify-end gap-3 mt-6">
              <button
                type="button"
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md"
                onClick={onClose}
              >
                Close
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 text-white rounded-md"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditUserModal;
