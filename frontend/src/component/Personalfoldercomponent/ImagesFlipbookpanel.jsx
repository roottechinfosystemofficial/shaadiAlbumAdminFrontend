import React, { useEffect, useState } from "react";
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
  const [flipbookImages, setFlipbookImages] = useState([]);
  const [frontCover, setFrontCover] = useState(null);
  const [backCover, setBackCover] = useState(null);
  const { singleEvent, selectedFlipBook } = useSelector((state) => state.event);
  const { accessToken } = useSelector((state) => state.user);
  const [optionsVisible, setOptionsVisible] = useState(null); // store index

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
      const filesMeta = selectedFiles.map((file) => ({
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
      }));

      const urlResponse = await apiRequest(
        "POST",
        `${S3_API_END_POINT}/get-presigned-url`,
        {
          eventId: singleEvent?._id,
          flipbookId: selectedFlipBook?._id,
          usageType: "flipbook",
          files: filesMeta,
        },
        accessToken,
        dispatch
      );

      const { urls } = urlResponse.data;

      const uploadPromises = urls.map((fileData, index) =>
        fetch(fileData.url, {
          method: "PUT",
          headers: {
            "Content-Type": selectedFiles[index].type,
          },
          body: selectedFiles[index],
        })
      );

      const results = await Promise.allSettled(uploadPromises);
      const failedUploads = results
        .map((res, idx) => ({ res, idx }))
        .filter(({ res }) => res.status !== "fulfilled");

      if (failedUploads.length > 0) {
        setErrorMsg(`${failedUploads.length} uploads failed.`);
      } else {
        setErrorMsg("");
        setSelectedFiles([]);
        setShowUploadBox(false);
        fetchFlipbookImages();
      }
    } catch (error) {
      console.error("Upload error:", error);
      setErrorMsg("Something went wrong during upload.");
    }
  };

  const fetchFlipbookImages = async () => {
    if (!singleEvent?._id || !selectedFlipBook?._id) return;
    try {
      const res = await apiRequest(
        "POST",
        `${S3_API_END_POINT}/list-images`,
        {
          eventId: singleEvent._id,
          flipbookId: selectedFlipBook._id,
          usageType: "flipbook",
        },
        accessToken,
        dispatch
      );
      if (res.status === 200) {
        setFlipbookImages(res.data.images || []);
      }
    } catch (err) {
      console.error("Image load error:", err);
    }
  };

  useEffect(() => {
    fetchFlipbookImages();
  }, [singleEvent?._id, selectedFlipBook?._id]);

  const handleSetCover = (index, type) => {
    if (type === "front") setFrontCover(index);
    else if (type === "back") setBackCover(index);
    setOptionsVisible(null); // hide dropdown after selection
  };

  return (
    <div className="p-4 md:p-6 lg:p-8">
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

      {flipbookImages.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {flipbookImages.map((img, index) => (
            <div
              key={index}
              className="relative border rounded overflow-hidden shadow-sm group"
            >
              <img
                src={img}
                alt={`Flipbook image ${index + 1}`}
                className="w-full h-60 object-contain"
              />
              <div className="absolute top-2 right-2 z-10">
                <button
                  className="p-1 rounded-full bg-white shadow hover:bg-gray-100"
                  onClick={() =>
                    setOptionsVisible((prev) => (prev === index ? null : index))
                  }
                >
                  <svg
                    className="w-5 h-5 text-gray-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M6 10a2 2 0 114 0 2 2 0 01-4 0zm4-6a2 2 0 11-4 0 2 2 0 014 0zm0 12a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </button>

                {/* Dropdown menu */}
                {optionsVisible === index && (
                  <div className="absolute top-10 right-0 bg-white shadow-lg rounded-md p-2 w-40 z-20">
                    <button
                      onClick={() => handleSetCover(index, "front")}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      {frontCover === index ? "✓ Frontcover" : "Set Frontcover"}
                    </button>
                    <button
                      onClick={() => handleSetCover(index, "back")}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      {backCover === index ? "✓ Backcover" : "Set Backcover"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-sm mt-6">No images uploaded yet.</p>
      )}
    </div>
  );
};

export default ImagesFlipbookpanel;
