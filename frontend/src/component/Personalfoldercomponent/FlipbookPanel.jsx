import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Trash, Image, PlusSquare } from "lucide-react";
import apiRequest from "../../utils/apiRequest.js";
import { FLIPBOOK_API_END_POINT } from "../../constant.js";
import { useDispatch, useSelector } from "react-redux";
import toast from "../../utils/toast.js";

function FlipbookPanel() {
  const [flipbooks, setFlipbooks] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({ flipBookName: "" });

  const dispatch = useDispatch();
  const { accessToken } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const { eventId } = useParams();

  const getAllFlipBookByEvent = async () => {
    try {
      const endpoint = `${FLIPBOOK_API_END_POINT}/getAllFlipBookByEvent/${eventId}`;
      const res = await apiRequest("GET", endpoint, {}, accessToken, dispatch);
      if (res?.status === 200) {
        setFlipbooks(res?.data?.data || []);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllFlipBookByEvent();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleAddFlipbookClick = () => {
    setFormData({ flipBookName: "" });
    setIsAddModalOpen(true);
  };

  const handleAddFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = `${FLIPBOOK_API_END_POINT}/createFlipBook/${eventId}`;
      const res = await apiRequest(
        "POST",
        endpoint,
        formData,
        accessToken,
        dispatch
      );
      if (res?.status === 200) {
        const createdFlipBook = res?.data?.data;
        toast.success("Flipbook created successfully!");
        setFlipbooks((prev) => [...prev, createdFlipBook]);
        await getAllFlipBookByEvent();
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to create flipbook");
    }
    setIsAddModalOpen(false);
  };

  const handleDeleteClick = (flipbookId) => {
    setFlipbooks(flipbooks.filter((fb) => fb?._id !== flipbookId));
  };

  return (
    <div className="p-6">
      {/* Header */}
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
        {flipbooks?.map((flipbook) => (
          <div
            key={flipbook?._id}
            className="bg-white shadow-lg rounded-xl p-4 flex flex-col items-start relative"
          >
            <button
              onClick={() => handleDeleteClick(flipbook?._id)}
              className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
            >
              <Trash className="h-4 w-4" />
            </button>

            <div className="text-lg font-semibold mb-2">
              {flipbook?.flipBookName || "Unnamed Flipbook"}
            </div>

            <p className="text-sm text-gray-500 mb-2">
              Event Code: {flipbook?.eventId?.eventCode || "N/A"}
            </p>

            <p className="text-sm text-gray-500 mb-2">
              Total Images: {/* Placeholder for images count */}N/A
            </p>

            <p className="text-sm text-gray-500 mb-4">
              Created:{" "}
              {flipbook?.createdAt
                ? new Date(flipbook.createdAt).toLocaleDateString()
                : "Unknown"}
            </p>

            <div className="flex justify-between gap-3 mt-auto w-full">
              <button
                onClick={() => navigate("/")}
                className="p-3 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center justify-center text-xs sm:text-sm w-full sm:w-[50%] gap-2"
              >
                <Image className="h-3 w-3" />
                <span>Open</span>
              </button>

              <button
                onClick={() => navigate("/")}
                className="p-3 bg-yellow-500 text-white rounded hover:bg-yellow-600 flex items-center justify-center text-xs sm:text-sm w-full sm:w-[50%] gap-2"
              >
                <Image className="h-3 w-3" />
                <span>Images</span>
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
                  name="flipBookName"
                  value={formData?.flipBookName || ""}
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
    </div>
  );
}

export default FlipbookPanel;
