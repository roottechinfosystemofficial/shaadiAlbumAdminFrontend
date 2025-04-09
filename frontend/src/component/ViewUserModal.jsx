import React from "react";

const ViewUserModal = ({ user, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-[999]">
      <div className="w-[700px] bg-white rounded-md shadow-lg overflow-hidden">
        <div className="flex justify-between items-center px-4 py-3 border-b bg-gray-100">
          <h2 className="text-lg font-semibold">View user</h2>
          <button
            className="text-2xl font-bold text-gray-600 hover:text-black"
            onClick={onClose}
          >
            &times;
          </button>
        </div>
        <div className="p-6 text-sm flex gap-5">
          <div className="w-[180px] text-center bg-gray-100 py-4 rounded">
            <img
              src="https://via.placeholder.com/80"
              alt="user"
              className="w-20 h-20 rounded-full object-cover bg-gray-200 mx-auto"
            />
            <p className="mt-2 font-medium">
              {user.name}(#{user.id})
            </p>
          </div>
          <div className="flex-1 grid grid-cols-2 gap-y-3 gap-x-5">
            <p>
              <span className="font-semibold">Email :</span> {user.email}
            </p>
            <p>
              <span className="font-semibold">Phone Number :</span> {user.phone}
            </p>
            <p>
              <span className="font-semibold">User Type :</span> {user.userType}
            </p>
            <p>
              <span className="font-semibold">Login Type :</span>{" "}
              {user.loginType}
            </p>
            <p>
              <span className="font-semibold">Created Date :</span>{" "}
              {new Date(user.createdDate).toLocaleDateString()}
            </p>
            <p>
              <span className="font-semibold">Email OTP Verification :</span>{" "}
              <span className="text-green-600 font-semibold">Verified</span>
            </p>
            <p>
              <span className="font-semibold">Mobile OTP Verification :</span>{" "}
              <span className="text-green-600 font-semibold">Verified</span>
            </p>
            <p>
              <span className="font-semibold">User Status :</span>{" "}
              <span className="text-green-600 font-semibold">
                {user.status}
              </span>
            </p>
            <p>
              <span className="font-semibold">Login Device :</span>{" "}
              {user.loginDevice}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewUserModal;
