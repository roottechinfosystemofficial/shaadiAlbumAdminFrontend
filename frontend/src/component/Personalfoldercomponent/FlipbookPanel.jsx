import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Edit2, Trash, Image, PlusSquare } from "lucide-react"; // Import Lucide Icons

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

  // Handle the edit button click
  const handleEditClick = (book) => {
    setSelectedBook(book);
    setFormData({ name: book.name, tile: null });
    setEditModalOpen(true);
  };

  // Handle the input changes (for text and file inputs)
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  // Handle form submission (save changes)
  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log("Updated Flipbook:", formData);
    setEditModalOpen(false);
  };

  // Navigate to the "Add Flipbook" page
  const handleAddFlipbookClick = () => {
    navigate("/addFlipbook");
  };

  return (
    <div className="p-6">
      {/* Add Back and Add Flipbook buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <h2 className="text-2xl font-bold mb-4">Flipbook List</h2>
        <button
          onClick={handleAddFlipbookClick}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center justify-center"
        >
          <PlusSquare className="h-5 w-5 mr-2" />
          <span className="hidden sm:inline">Add Flipbook</span>
        </button>
      </div>

      {/* Flipbook Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {flipbooks.map((book) => (
          <div
            key={book.id}
            className="bg-white shadow-lg rounded-xl p-4 flex flex-col items-start relative"
          >
            {/* Delete Icon */}
            <button
              onClick={() => console.log("Delete book", book.id)} // Replace with actual delete functionality
              className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
            >
              <Trash className="h-4 w-4" />
            </button>

            <div className="text-lg font-semibold mb-2">{book.name}</div>
            <p className="text-sm text-gray-500 mb-2">Event Id: {book.id}</p>
            <p className="text-sm text-gray-500 mb-2">Size: {book.size}</p>
            <p className="text-sm text-gray-500 mb-2">
              Total Images: {book.totalImages}
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Created: {book.createdDate}
            </p>

            {/* Action Buttons */}
            <div className="flex  justify-between gap-3 mt-auto w-full ">
              <button
                onClick={() => navigate("/flipbookUser")}
                className="p-3 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center justify-center text-xs sm:text-sm w-full sm:w-[50%] gap-2 "
              >
                <Image className="h-3 w-3" />
                <span className="">Open</span>
              </button>
              <button
                className="p-3 bg-green-600 text-white rounded hover:bg-green-700 flex items-center justify-center text-xs sm:text-sm w-full sm:w-[50%] gap-2 "
                onClick={() => handleEditClick(book)}
              >
                <Edit2 className="h-3 w-3" />
                <span className="">Edit</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg sm:max-w-md">
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
