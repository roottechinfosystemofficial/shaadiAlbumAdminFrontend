import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPersonalFolderContentTab } from "../../Redux/Slices/TabSlice";
import apiRequest from "../../utils/apiRequest";
import { FLIPBOOK_API_END_POINT, S3_API_END_POINT } from "../../constant";
import { Loader } from "../Loader";

const MAX_FILES = 200;
const MAX_FILE_SIZE_MB = 10;

const ImagesFlipbookpanel = () => {
  const dispatch = useDispatch();
  const [showUploadBox, setShowUploadBox] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [flipbookImages, setFlipbookImages] = useState([]);
  const [loadingImages, setLoadingImages] = useState(true);

  const { currentEvent, currentFlipbook } = useSelector((state) => state.event);
  const { accessToken } = useSelector((state) => state.user);
  const [frontCover, setFrontCover] = useState("");
  const [backCover, setBackCover] = useState("");

  useEffect(() => {
    if (currentFlipbook) {
      setFrontCover(currentFlipbook?.flipbookImages?.frontCoverImageIndex);
      setBackCover(currentFlipbook?.flipbookImages?.backCoverImageIndex);
    }
  }, [currentFlipbook]);

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
          eventId: currentEvent?._id,
          flipbookId: currentFlipbook?._id,
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
    if (!currentEvent?._id || !currentFlipbook?._id) return;

    try {
      setLoadingImages(true);
      const res = await apiRequest(
        "POST",
        `${S3_API_END_POINT}/list-flipBookimages`,
        {
          eventId: currentEvent._id,
          flipbookId: currentFlipbook._id,
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
    } finally {
      setLoadingImages(false);
    }
  };

  useEffect(() => {
    fetchFlipbookImages();
  }, [currentEvent?._id, currentFlipbook?._id]);

  const handleSetCover = async (index, type) => {
    try {
      const endpoint = `${FLIPBOOK_API_END_POINT}/setFrontBackCoverImg`;
      const res = await apiRequest(
        "POST",
        endpoint,
        {
          flipbookId: currentFlipbook._id,
          imageIndex: index,
          type,
        },
        accessToken,
        dispatch
      );
      if (res.status === 200) {
        if (type === "front") setFrontCover(index);
        else if (type === "back") setBackCover(index);
      }
    } catch (error) {
      console.error("Failed to set cover image index", error);
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <button
          className="bg-slate px-4 py-2 rounded hover:bg-slate-dark"
          onClick={handleBackClick}
        >
          Back
        </button>
        <button
          className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark"
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
            >
              &times;
            </button>
          </div>

          <label
            htmlFor="image-upload"
            className="flex flex-col items-center justify-center w-full border-2 border-dashed border-emerald-400 rounded-lg p-4 cursor-pointer hover:border-emerald-500 hover:bg-emerald-50 transition mb-4"
          >
            <svg
              className="w-8 h-8 text-emerald-400 mb-2"
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
            <p className="text-emerald-600 font-medium text-center">
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
                  className="flex justify-between items-center bg-slate-100 px-3 py-2 rounded"
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
              className="bg-slate-200 px-4 py-2 rounded hover:bg-slate-300"
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              className="bg-primary-dark text-white px-4 py-2 rounded hover:bg-primary"
              disabled={selectedFiles.length === 0}
            >
              Upload
            </button>
          </div>
        </div>
      )}

      {loadingImages ? (
        <Loader message="Images are on their way, please wait..." />
      ) : flipbookImages.length === 0 ? (
        <p className="text-center mt-10 text-slate-500">
          No images available. Please upload images to your flipbook.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {flipbookImages.map((img, index) => (
            <div
              key={index}
              className={`relative border-2 rounded-lg overflow-hidden shadow-lg group ${
                frontCover === index || backCover === index
                  ? "border-primary-dark"
                  : "border-slate"
              }`}
            >
              <img
                src={img || "https://via.placeholder.com/150"}
                alt={`Flipbook image ${index + 1}`}
                className="w-full h-60 object-contain"
              />
              <div className="absolute top-0 right-0">
                <div className="relative group">
                  <button className="text-sm px-3 py-1 bg-white border">
                    {frontCover === index
                      ? "Front Cover"
                      : backCover === index
                      ? "Back Cover"
                      : "Choose Cover"}
                  </button>
                  <div className="absolute top-full left-0 w-full bg-white border hidden group-hover:block z-10">
                    <button
                      onClick={() => handleSetCover(index, "front")}
                      className="w-full text-sm text-left px-4 py-2 hover:bg-slate-100"
                    >
                      {frontCover === index
                        ? "Front Cover"
                        : "Set as Front Cover"}
                    </button>
                    <button
                      onClick={() => handleSetCover(index, "back")}
                      className="w-full text-sm text-left px-4 py-2 hover:bg-slate-100"
                    >
                      {backCover === index ? "Back Cover" : "Set as Back Cover"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImagesFlipbookpanel;
