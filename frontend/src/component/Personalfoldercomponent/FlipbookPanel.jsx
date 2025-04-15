import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const flipbooks = [
  {
    id: "EVT001",
    name: "Wedding Album",
    size: "20MB",
    totalImages: 50,
    createdDate: "2025-04-10",
  },
  {
    id: "EVT002",
    name: "Birthday Memories",
    size: "15MB",
    totalImages: 30,
    createdDate: "2025-04-08",
  },
];

function FlipbookPanel() {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    tile: null,
  });
  const navigate = useNavigate();
  const handleEditClick = (book) => {
    setSelectedBook(book);
    setFormData({ name: book.name, tile: null });
    setEditModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log("Updated Flipbook:", formData);
    setEditModalOpen(false);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Flipbook List</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2 text-left">Event Id</th>
              <th className="border px-4 py-2 text-left">Flipbook Name</th>
              <th className="border px-4 py-2 text-left">Size</th>
              <th className="border px-4 py-2 text-left">Total Images</th>
              <th className="border px-4 py-2 text-left">Created Date</th>
              <th className="border px-4 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {flipbooks.map((book) => (
              <tr key={book.id} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{book.id}</td>
                <td className="border px-4 py-2">{book.name}</td>
                <td className="border px-4 py-2">{book.size}</td>
                <td className="border px-4 py-2">{book.totalImages}</td>
                <td className="border px-4 py-2">{book.createdDate}</td>
                <td className="border px-4 py-2 space-x-2">
                  <button
                    onClick={() => navigate("/flipbookUser")}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Open
                  </button>
                  <button
                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                    onClick={() => handleEditClick(book)}
                  >
                    Edit
                  </button>
                  <button className="px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600">
                    Images
                  </button>
                  <button className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Edit Flipbook</h3>
            <form onSubmit={handleFormSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Flipbook Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Tile <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  name="tile"
                  onChange={handleInputChange}
                  required
                  className="w-full"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  onClick={() => setEditModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default FlipbookPanel;
