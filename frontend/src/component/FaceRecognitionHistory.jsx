import React, { useEffect, useState } from "react";
import axios from "axios";
import { IoEyeOutline as EyeIcon } from "react-icons/io5";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { useSelector } from "react-redux";
import apiRequest from "../utils/apiRequest";
import { S3_API_END_POINT } from "../constant";
import LoaderModal from "./LoadingModal";
import ErrorModal from "./UsersComponent/ErrorModal";
import { ArrowLeft } from "lucide-react";

const ITEMS_PER_PAGE = 10;

export const FaceRecognitionHistory = () => {
  const [history, setHistory] = useState([]);
  const [page, setPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loader, setLoader] = useState(false);
  const [error, setError] = useState("");

  // Search / Filter / Sort states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubEvent, setFilterSubEvent] = useState('');
  const [sortBy, setSortBy] = useState('');

  const { accessToken, authUser } = useSelector((state) => state.user);

  const fetchHistory = async () => {
    setLoader(true);
    setError('');
    try {
      const res = await apiRequest("GET", `${S3_API_END_POINT}/face-recognition-history/${authUser?._id}?page=${page}`);
      setHistory(res.data.history || []);
    } catch (err) {
      console.error("Error fetching history", err);
      setError(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [searchTerm, filterSubEvent, sortBy]);

  const handleView = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const filtered = history
    .filter((item) =>
      item.eventName?.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterSubEvent === '' || item.subEventId === filterSubEvent)
    )
    .sort((a, b) => {
      if (sortBy === 'date-desc') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'date-asc') return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === 'match-desc') return b.matchesCount - a.matchesCount;
      if (sortBy === 'match-asc') return a.matchesCount - b.matchesCount;
      return 0;
    });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <div className="p-6 bg-gray-100 min-h-screen text-gray-800">
        <div className="flex items-center gap-4 mb-6">
  <button
    onClick={() => window.history.back()}
    className="text-gray-600 hover:text-black transition text-2xl"
    title="Go back"
  >
    <ArrowLeft/>
  </button>
  <h1 className="text-2xl font-bold text-center w-full">Face Recognition History</h1>
</div>

      {/* Search, Filter, Sort Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <input
          type="text"
          placeholder="Search event name..."
          className="px-4 py-2 border rounded shadow-sm w-full sm:w-1/3"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="px-4 py-2 border rounded shadow-sm w-full sm:w-1/4"
          value={filterSubEvent}
          onChange={(e) => setFilterSubEvent(e.target.value)}
        >
          <option value="">All Sub Events</option>
          {[...new Set(history.map((item) => item.subEventId))].map((id) => (
            <option key={id} value={id}>{id}</option>
          ))}
        </select>
        <select
          className="px-4 py-2 border rounded shadow-sm w-full sm:w-1/4"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="">Sort By</option>
          <option value="date-desc">Date ↓</option>
          <option value="date-asc">Date ↑</option>
          <option value="match-desc">Matches ↓</option>
          <option value="match-asc">Matches ↑</option>
        </select>
      </div>

      {/* History Table */}
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50 text-left font-semibold text-gray-600">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Uploaded Image</th>
              <th className="px-4 py-3">Event Name</th>
              <th className="px-4 py-3">Sub Event</th>
              <th className="px-4 py-3">Matches</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Match Results</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {paginated.length > 0 ? (
              paginated.map((item, idx) => (
                <tr key={item._id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{(page - 1) * ITEMS_PER_PAGE + idx + 1}</td>
                  <td className="px-4 py-2">
                    <div className="flex justify-center items-center">
                      <img src={item.image} alt="Uploaded" className="w-20 h-20 object-contain rounded-md border shadow" />
                    </div>
                  </td>
                  <td className="px-4 py-2">{item.eventName ?? 'my test event'}</td>
                  <td className="px-4 py-2">{item.subEventId}</td>
                  <td className="px-4 py-2">{item.matchesCount}</td>
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
            {Math.min(page * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}
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
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto relative p-6">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Face Recognition Results</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-600 hover:text-red-500 text-2xl">
                <IoIosCloseCircleOutline />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-1 font-semibold">Uploaded Image:</p>
              <img
                src={selectedItem.image}
                alt="Uploaded"
                className="w-full max-h-72 object-contain rounded-md border shadow"
              />
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-2 font-semibold">
                {selectedItem.matches?.length > 0
                  ? `Matched Images (${selectedItem.matches.length})`
                  : "No matches found"}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {selectedItem.matches?.map((match, idx) => (
                  <div key={idx} className="bg-gray-50 border rounded-lg shadow hover:shadow-md p-2 transition">
                    <img
                      src={match.url}
                      alt={`Match ${idx + 1}`}
                      className="w-full h-40 object-cover rounded"
                    />
                    <div className="text-xs text-gray-700 mt-1 text-center">
                      Similarity:{" "}
                      <span className="font-semibold text-green-600">{match.similarity}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <LoaderModal message="Loading Face Recognition History..." isOpen={loader} />
      <ErrorModal message={error} isOpen={error !== ''} />
    </div>
  );
};
