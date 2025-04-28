import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Edit2, Trash, Image, PlusSquare } from "lucide-react";

// Only ONE sample flipbook now
const initialFlipbooks = [
  {
    id: "EVT001",
    name: "Sample Flipbook",
    size: "10MB",
    totalImages: 10,
    createdDate: "2025-04-10",
  },
];

function FlipbookPanel() {
  const [flipbooks, setFlipbooks] = useState(initialFlipbooks);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedFlipbook, setSelectedFlipbook] = useState(null);
  const [formData, setFormData] = useState({
    flipBookname: "",
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleEditClick = (flipbook) => {
    setSelectedFlipbook(flipbook);
    setFormData({ name: flipbook.name, tile: null });
    setIsEditModalOpen(true);
  };

  const handleEditFormSubmit = (e) => {
    e.preventDefault();
    console.log("Updated Flipbook:", formData);
    setIsEditModalOpen(false);
  };

  const handleAddFlipbookClick = () => {
    setFormData({ name: "", tile: null });
    setIsAddModalOpen(true);
  };

  // Only LOG formData on Add Submit (don't update the list)
  const handleAddFormSubmit = async(e) => {
    e.preventDefault();
    console.log("New Flipbook Submitted:", formData);
    
    setIsAddModalOpen(false);
  };

  const handleDeleteClick = (flipbookId) => {
    const updatedFlipbooks = flipbooks.filter((fb) => fb.id !== flipbookId);
    setFlipbooks(updatedFlipbooks);
  };

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <h2 className="text-2xl font-bold mb-4">Flipbook List</h2>
        <button
          onClick={handleAddFlipbookClick}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center justify-center"
        >
          <PlusSquare className="h-5 w-5 mr-2" />
          <span>Add Flipbook</span>
        </button>
      </div>

      {/* Flipbook Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {flipbooks.map((flipbook) => (
          <div
            key={flipbook.id}
            className="bg-white shadow-lg rounded-xl p-4 flex flex-col items-start relative"
          >
            <button
              onClick={() => handleDeleteClick(flipbook.id)}
              className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
            >
              <Trash className="h-4 w-4" />
            </button>

            <div className="text-lg font-semibold mb-2">{flipbook.name}</div>
            <p className="text-sm text-gray-500 mb-2">
              Event Id: {flipbook.id}
            </p>
            <p className="text-sm text-gray-500 mb-2">Size: {flipbook.size}</p>
            <p className="text-sm text-gray-500 mb-2">
              Total Images: {flipbook.totalImages}
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Created: {flipbook.createdDate}
            </p>

            <div className="flex justify-between gap-3 mt-auto w-full">
              <button
                onClick={() => navigate("/flipbookUser")}
                className="p-3 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center justify-center text-xs sm:text-sm w-full sm:w-[50%] gap-2"
              >
                <Image className="h-3 w-3" />
                <span>Open</span>
              </button>
              <button
                onClick={() => handleEditClick(flipbook)}
                className="p-3 bg-green-600 text-white rounded hover:bg-green-700 flex items-center justify-center text-xs sm:text-sm w-full sm:w-[50%] gap-2"
              >
                <Edit2 className="h-3 w-3" />
                <span>Edit</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Flipbook Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg sm:max-w-md">
            <h3 className="text-xl font-semibold mb-4">Add Flipbook</h3>
            <form onSubmit={handleAddFormSubmit}>
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
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Flipbook Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg sm:max-w-md">
            <h3 className="text-xl font-semibold mb-4">Edit Flipbook</h3>
            <form onSubmit={handleEditFormSubmit}>
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
                  onClick={() => setIsEditModalOpen(false)}
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
