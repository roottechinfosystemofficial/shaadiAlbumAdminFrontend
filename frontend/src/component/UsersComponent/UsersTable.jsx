import React from "react";

const UserTable = ({ newClientViewUser, onView, onEdit }) => {
  return (
    <div className="p-4 shadow-[0_3px_15px_rgba(0,0,0,0.06)] bg-white rounded">
      <table className="w-full border-collapse mb-4 text-sm">
        <thead>
          <tr className="bg-slate text-gray-700">
            <th className="border border-slate-dark p-2">
              
            </th>
            <th className="border border-slate-dark p-2">Sr.No</th>
            <th className="border border-slate-dark p-2">Name</th>
            <th className="border border-slate-dark p-2">Email</th>
            <th className="border border-slate-dark p-2">Phone No.</th>
            <th className="border border-slate-dark p-2">Event Name</th>
            <th className="border border-slate-dark p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {newClientViewUser?.length ? (
            newClientViewUser.map((user, index) => (
              <tr key={user._id}>
                <td className="border border-slate-dark p-2">
                  <input type="checkbox" />
                </td>
                <td className="border border-slate-dark p-2">{index + 1}</td>
                <td className="border border-slate-dark p-2">{user.name}</td>
                <td className="border border-slate-dark p-2">{user.email}</td>
                <td className="border border-slate-dark p-2">{user.phone}</td>
                <td className="border border-slate-dark p-2">
                  {user.eventId?.eventName || "—"}
                </td>
                <td className="border border-slate-dark p-2">
                  <div className="flex gap-3 justify-end">
                    <button
                      className="px-2 py-1 rounded text-white text-xs bg-primary hover:bg-primary-dark transition"
                      onClick={() => onView(user)}
                    >
                      👁 View
                    </button>
                    <button
                      className="px-2 py-1 rounded text-white text-xs bg-yellow-500 hover:bg-yellow-600 transition"
                      onClick={() => onEdit(user)}
                    >
                      ✏ Edit
                    </button>
                    <button className="px-2 py-1 rounded text-white text-xs bg-red-500 hover:bg-red-600 transition">
                      🗑 Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center py-4 text-slate-dark">
                No record exists
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600">
          Show{" "}
          <select className="px-2 py-1 border border-slate-dark rounded mx-1">
            <option>10</option>
            <option>25</option>
            <option>50</option>
            <option>100</option>
          </select>{" "}
          entries
        </div>
        <div className="flex items-center gap-1">
          <button className="px-3 py-1 text-sm border border-slate-dark bg-slate text-gray-700 rounded hover:bg-slate-dark transition">
            Previous
          </button>
          <button className="px-3 py-1 text-sm border border-primary bg-primary text-white rounded hover:bg-primary-dark transition">
            1
          </button>
          <button className="px-3 py-1 text-sm border border-slate-dark bg-slate text-gray-700 rounded hover:bg-slate-dark transition">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserTable;
