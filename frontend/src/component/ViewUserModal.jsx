import React from "react";

const ViewUserModal = ({ user, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-[999]">
      <div className="w-[750px] bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b bg-gray-100">
          <h2 className="text-xl font-semibold text-gray-800">View User</h2>
          <button
            className="text-2xl font-bold text-gray-500 hover:text-black"
            onClick={onClose}
          >
            &times;
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex gap-6 text-sm">
          {/* Avatar */}
          <div className="w-[160px] flex flex-col items-center gap-3 bg-gray-50 p-4 rounded-lg">
            <img
              src={user.imageUrl || "https://via.placeholder.com/80"}
              alt="user"
              className="w-20 h-20 rounded-full object-cover border border-gray-300"
            />
            <p className="text-center text-base font-medium text-gray-700">
              {user.name || "Unknown"}
            </p>
            <p className="text-xs text-gray-500">#{user.id || "N/A"}</p>
          </div>

          {/* Details */}
          <div className="flex-1 grid grid-cols-2 gap-y-4 gap-x-6 text-sm text-gray-700">
            <p>
              <span className="font-semibold">Email:</span>{" "}
              {user.email || "N/A"}
            </p>
            <p>
              <span className="font-semibold">Phone Number:</span>{" "}
              {user.phone || "N/A"}
            </p>
            <p>
              <span className="font-semibold">User Type:</span>{" "}
              {user.userType || "N/A"}
            </p>
            <p>
              <span className="font-semibold">Login Type:</span>{" "}
              {user.loginType || "N/A"}
            </p>
            <p>
              <span className="font-semibold">Created Date:</span>{" "}
              {user.createdDate
                ? new Date(user.createdDate).toLocaleDateString()
                : "N/A"}
            </p>
            <p>
              <span className="font-semibold">Email OTP Verification:</span>{" "}
              <span
                className={
                  user.emailVerified
                    ? "text-green-600 font-medium"
                    : "text-red-500 font-medium"
                }
              >
                {user.emailVerified ? "Verified" : "Not Verified"}
              </span>
            </p>
            <p>
              <span className="font-semibold">Mobile OTP Verification:</span>{" "}
              <span
                className={
                  user.mobileVerified
                    ? "text-green-600 font-medium"
                    : "text-red-500 font-medium"
                }
              >
                {user.mobileVerified ? "Verified" : "Not Verified"}
              </span>
            </p>
            <p>
              <span className="font-semibold">User Status:</span>{" "}
              <span
                className={
                  user.status === "Active"
                    ? "text-green-600 font-medium"
                    : "text-yellow-600 font-medium"
                }
              >
                {user.status || "N/A"}
              </span>
            </p>
            <p>
              <span className="font-semibold">Login Device:</span>{" "}
              {user.loginDevice || "N/A"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewUserModal;
