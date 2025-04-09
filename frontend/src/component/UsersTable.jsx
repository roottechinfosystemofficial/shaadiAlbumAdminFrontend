import React from "react";

const UserTable = ({ users, onView, onEdit }) => {
  return (
    <div className="p-2 shadow-[0_3px_15px_rgba(0,0,0,0.06)] bg-white">
      <div className="flex justify-between items-center mb-4">
        <select className="p-2 text-sm border border-gray-400 rounded text-gray-500 w-1/4">
          <option>All Users</option>
          <option>Guest Users</option>
          <option>Event Users</option>
        </select>
        <div className="flex items-center gap-2">
          <label className="text-gray-600">Search:</label>
          <input
            type="text"
            className="p-2 text-sm border border-gray-400 rounded w-52"
          />
        </div>
      </div>

      <table className="w-full border-collapse mb-4 text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-200 p-2">
              <input type="checkbox" />
            </th>
            <th className="border border-gray-200 p-2">##</th>
            <th className="border border-gray-200 p-2">Name</th>
            <th className="border border-gray-200 p-2">Email</th>
            <th className="border border-gray-200 p-2">Phone No.</th>
            <th className="border border-gray-200 p-2">Favorites</th>
            <th className="border border-gray-200 p-2">Created Date</th>
            <th className="border border-gray-200 p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.length ? (
            users.map((user, index) => (
              <tr key={user.id}>
                <td className="border border-gray-200 p-2">
                  <input type="checkbox" />
                </td>
                <td className="border border-gray-200 p-2">{index + 1}</td>
                <td className="border border-gray-200 p-2">{user.name}</td>
                <td className="border border-gray-200 p-2">{user.email}</td>
                <td className="border border-gray-200 p-2">{user.phone}</td>
                <td
                  className={`border border-gray-200 p-2 ${
                    user.favorites === 0 ? "text-red-500" : ""
                  }`}
                >
                  {user.favorites}
                </td>
                <td className="border border-gray-200 p-2">
                  {user.createdDate}
                </td>
                <td className="border border-gray-200 p-2">
                  <div className="flex gap-1">
                    <button
                      className="px-2 py-1 rounded text-white text-xs bg-gray-600"
                      onClick={() => onView(user)}
                    >
                      👁 View
                    </button>
                    <button
                      className="px-2 py-1 rounded text-white text-xs bg-yellow-500"
                      onClick={() => onEdit(user)}
                    >
                      ✏ Edit
                    </button>
                    <button className="px-2 py-1 rounded text-white text-xs bg-red-500">
                      🗑 Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="text-center py-4 text-gray-500">
                No record exists
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="flex justify-between items-center">
        <div className="text-sm">
          Show{" "}
          <select className="px-2 py-1 border border-gray-400 rounded mx-1">
            <option>10</option>
            <option>25</option>
            <option>50</option>
            <option>100</option>
          </select>{" "}
          entries
        </div>
        <div className="flex items-center gap-1">
          <button className="px-3 py-1 text-sm border border-gray-300 bg-gray-100 rounded">
            Previous
          </button>
          <button className="px-3 py-1 text-sm border border-gray-300 bg-gray-700 text-white rounded">
            1
          </button>
          <button className="px-3 py-1 text-sm border border-gray-300 bg-gray-100 rounded">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserTable;
