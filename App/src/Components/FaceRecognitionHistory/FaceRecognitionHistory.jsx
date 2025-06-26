import React, { useEffect, useState } from "react";
import axios from "axios";
import { EyeIcon } from "react-icons"; // optional icon lib

const ITEMS_PER_PAGE = 10;

export const FaceRecognitionHistory = () => {
const [history, setHistory] = useState([]);
const [page, setPage] = useState(1);
const [selectedItem, setSelectedItem] = useState(null);
const [showModal, setShowModal] = useState(false);

const fetchHistory = async () => {
try {
const res = await axios.get("/api/face-recognition/history");
setHistory(res.data.history || []);
} catch (err) {
console.error("Error fetching history", err);
}
};

useEffect(() => {
fetchHistory();
}, []);

const totalPages = Math.ceil(history.length / ITEMS_PER_PAGE);
const paginated = history.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

const handleView = (item) => {
setSelectedItem(item);
setShowModal(true);
};

return (
<div className="p-6 bg-gray-100 min-h-screen text-gray-800">
<h1 className="text-2xl font-bold mb-6">Face Recognition History</h1>

php-template
Copy
Edit
  <div className="overflow-x-auto bg-white shadow rounded-lg">
    <table className="min-w-full divide-y divide-gray-200 text-sm">
      <thead className="bg-gray-50 text-left font-semibold text-gray-600">
        <tr>
          <th className="px-4 py-3">#</th>
          <th className="px-4 py-3">User</th>
          <th className="px-4 py-3">Event</th>
          <th className="px-4 py-3">Sub Event</th>
          <th className="px-4 py-3">Matches</th>
          <th className="px-4 py-3">Date</th>
          <th className="px-4 py-3">View</th>
        </tr>
      </thead>
      <tbody className="text-gray-700">
        {paginated.length > 0 ? (
          paginated.map((item, idx) => (
            <tr key={item._id} className="border-t hover:bg-gray-50">
              <td className="px-4 py-2">{(page - 1) * ITEMS_PER_PAGE + idx + 1}</td>
              <td className="px-4 py-2">{item.user?.email}</td>
              <td className="px-4 py-2">{item.event?.eventName}</td>
              <td className="px-4 py-2">{item.subEventId}</td>
              <td className="px-4 py-2">{item.matches?.length || 0}</td>
              <td className="px-4 py-2">{new Date(item.createdAt).toLocaleDateString()}</td>
              <td className="px-4 py-2">
                <button
                  className="text-indigo-600 hover:text-indigo-800 transition"
                  onClick={() => handleView(item)}
                  title="View matches"
                >
                  <EyeIcon className="h-5 w-5" />
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="7" className="text-center px-4 py-6 text-gray-500">
              No recognition history found.
            </td>
          </tr>
        )}
      </tbody>
    </table>

    {/* Pagination */}
    <div className="flex justify-between items-center p-4 text-sm text-gray-600">
      <div>
        Showing {(page - 1) * ITEMS_PER_PAGE + 1} to{" "}
        {Math.min(page * ITEMS_PER_PAGE, history.length)} of {history.length}
      </div>
      <div className="space-x-2">
        <button
          onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          className="px-3 py-1 border rounded disabled:opacity-50"
          disabled={page === 1}
        >
          Prev
        </button>
        <button
          onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
          className="px-3 py-1 border rounded disabled:opacity-50"
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  </div>

  {/* Modal */}
  {showModal && selectedItem && (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-4xl rounded-lg p-6 relative">
        <h2 className="text-xl font-semibold mb-4">Matched Images</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
          <div className="col-span-full">
            <p className="text-sm mb-1 font-medium">Uploaded Image:</p>
            <img
              src={selectedItem.uploadedImage}
              alt="Uploaded"
              className="w-full max-h-60 object-contain rounded shadow"
            />
          </div>

          {selectedItem.matches?.map((match, idx) => (
            <div
              key={idx}
              className="border rounded shadow-sm p-2 bg-gray-50"
            >
              <img
                src={match.matchUrl}
                alt={`Match ${idx + 1}`}
                className="w-full h-36 object-cover rounded mb-1"
              />
              <div className="text-xs text-gray-600">
                Similarity: <strong>{match.similarity}%</strong>
                <br />
                <span className="truncate">{match.s3Key}</span>
              </div>
            </div>
          ))}
        </div>

        <button
          className="absolute top-2 right-3 text-lg text-gray-700 hover:text-red-600"
          onClick={() => setShowModal(false)}
        >
          &times;
        </button>
      </div>
    </div>
  )}
</div>
);
};

