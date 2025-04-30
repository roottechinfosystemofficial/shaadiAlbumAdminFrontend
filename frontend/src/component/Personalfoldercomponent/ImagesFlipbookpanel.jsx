import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPersonalFolderContentTab } from "../../Redux/Slices/TabSlice";
import apiRequest from "../../utils/apiRequest";
import { S3_API_END_POINT } from "../../constant";

const MAX_FILES = 200;
const MAX_FILE_SIZE_MB = 10;

const ImagesFlipbookpanel = () => {
  const dispatch = useDispatch();
  const [showUploadBox, setShowUploadBox] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const { singleEvent } = useSelector((state) => state.event);
  const { accessToken } = useSelector((state) => state.user);

  const handleBackClick = () => {
    dispatch(setPersonalFolderContentTab("flipbook"));
  };

  const handleAddImagesClick = () => {
    setShowUploadBox(true);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const imageFiles = files.filter(
      (file) =>
        file.type.startsWith("image/") &&
        file.size <= MAX_FILE_SIZE_MB * 1024 * 1024
    );

    if (files.some((file) => file.size > MAX_FILE_SIZE_MB * 1024 * 1024)) {
      setErrorMsg("Some images exceed the 10MB limit and were skipped.");
    } else {
      setErrorMsg("");
    }

    const combined = [...selectedFiles, ...imageFiles];
    if (combined.length > MAX_FILES) {
      setErrorMsg("You can select a maximum of 200 images.");
      return;
    }

    setSelectedFiles(combined);
  };

  const handleRemove = (indexToRemove) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  const handleClose = () => {
    setShowUploadBox(false);
    setErrorMsg("");
    setSelectedFiles([]);
  };

  const handleUpload = async () => {
    try {
      const urlResponse = await apiRequest(
        "POST",
        `${S3_API_END_POINT}/get-presigned-url`,
        {
          eventId: singleEvent?._id,

          files: [
            {
              fileName: selectedFiles.name,
              fileType: selectedFiles.type,
              fileSize: selectedFiles.size,
            },
          ],
        },
        accessToken,
        dispatch
      );
      console.log(urlResponse);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8">
      {/* Top Buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <button
          className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 transition"
          onClick={handleBackClick}
        >
          Back
        </button>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          onClick={handleAddImagesClick}
        >
          Add Images
        </button>
      </div>

      {/* Upload Box Modal */}
      {showUploadBox && (
        <div className="fixed top-[20%] left-[60%] -translate-x-1/2 w-full max-w-2xl bg-white shadow-lg border rounded-lg z-50 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">
              Upload Images (Max 200, Max 10MB each)
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-red-500 font-bold text-xl"
              title="Close"
            >
              &times;
            </button>
          </div>

          <label
            htmlFor="image-upload"
            className="flex flex-col items-center justify-center w-full border-2 border-dashed border-blue-400 rounded-lg p-4 cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition mb-4"
          >
            <svg
              className="w-8 h-8 text-blue-400 mb-2"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 16l4-4 4 4m0 0l4-4 4 4M4 12h16"
              />
            </svg>
            <p className="text-blue-600 font-medium text-center">
              Click or drag images here to upload
            </p>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          {errorMsg && <p className="text-red-500 text-sm mb-3">{errorMsg}</p>}

          {selectedFiles.length > 0 && (
            <div className="max-h-60 overflow-y-auto border rounded-md p-3 space-y-2 mb-4">
              {selectedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center bg-gray-100 px-3 py-2 rounded"
                >
                  <span className="text-sm truncate w-4/5">{file.name}</span>
                  <button
                    onClick={() => handleRemove(index)}
                    className="text-red-500 text-sm hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="mt-4 flex justify-end gap-3">
            <button
              onClick={handleClose}
              className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
              disabled={selectedFiles.length === 0}
            >
              Upload
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImagesFlipbookpanel;
