import React, { useState } from "react";
import axios from "axios";
import imageCompression from "browser-image-compression";
import { X, CheckCircle, Circle, FolderOpen, ImagePlus } from "lucide-react";
import { useSelector } from "react-redux";

const AddPhotosModal = ({ isOpen, onClose, onUploadSuccess }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [duplicateHandling, setDuplicateHandling] = useState("skip");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedCount, setUploadedCount] = useState(0);
  const [uploadStartTime, setUploadStartTime] = useState(null);
  const { singleEvent } = useSelector((state) => state.event); // Assuming `singleEvent` is available from the Redux store

  if (!isOpen) return null; // Don't render the modal if it's not open

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles((prev) => [...prev, ...files]);
  };

  const handleClose = () => {
    setSelectedFiles([]);
    setUploadProgress(0);
    setUploadedCount(0);
    setUploading(false);
    onClose(); // Close the modal
  };

  const handleRemoveFile = (index) => {
    const updated = [...selectedFiles];
    updated.splice(index, 1);
    setSelectedFiles(updated);
  };

  const handleDuplicateOption = (mode) => {
    setDuplicateHandling(mode); // Set the duplicate handling option (either "skip" or "overwrite")
  };

  const getTimeLeft = () => {
    if (!uploadStartTime || uploadedCount === 0) return "Calculating...";

    const elapsed = (Date.now() - uploadStartTime) / 1000; // seconds
    const avgTimePerFile = elapsed / uploadedCount;
    const remaining = (selectedFiles.length - uploadedCount) * avgTimePerFile;

    const mins = Math.floor(remaining / 60);
    const secs = Math.floor(remaining % 60);

    return `${mins}m ${secs}s`;
  };

  const handleUpload = async () => {
    setUploading(true);
    setUploadProgress(0);
    setUploadedCount(0);
    setUploadStartTime(Date.now());

    try {
      const compressedList = [];

      // Compress the files before uploading
      for (let file of selectedFiles) {
        const compressed = await imageCompression(file, {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        });

        compressedList.push({
          file: compressed,
          fileName: compressed.name,
          fileType: compressed.type,
        });
      }

      // Step 1: Get presigned URLs from the backend
      const { data } = await axios.post(
        "http://localhost:5000/api/v1/api/s3/get-presigned-url",
        {
          eventId: singleEvent?._id, // Assuming `singleEvent` has the event ID
          files: compressedList.map(({ fileName, fileType }) => ({
            fileName,
            fileType,
          })),
        }
      );

      // Step 2: Upload files to S3
      for (let i = 0; i < data.urls.length; i++) {
        await axios.put(data.urls[i].url, compressedList[i].file, {
          headers: { "Content-Type": compressedList[i].file.type },
        });

        // Update progress and count
        setUploadedCount((count) => count + 1);
        setUploadProgress(((i + 1) / selectedFiles.length) * 100);
      }

      // After uploading is complete, call the success callback
      setUploading(false);
      setSelectedFiles([]);
      onUploadSuccess(); // Trigger the callback to refresh images in the parent component
      handleClose(); // Close the modal
    } catch (err) {
      console.error("Upload error:", err);
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-xl px-6 py-10 w-[95%] max-w-2xl shadow-2xl relative animate-fadeIn flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Upload Photos</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-red-500"
          >
            <X />
          </button>
        </div>

        {/* Duplicate Handling */}
        <div className="flex items-center gap-4 mb-4">
          {["skip", "overwrite"].map((mode) => (
            <button
              key={mode}
              onClick={() => handleDuplicateOption(mode)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border transition ${
                duplicateHandling === mode
                  ? "bg-primary text-white border-primary"
                  : "bg-gray-100 border-gray-300 text-gray-700"
              }`}
            >
              {duplicateHandling === mode ? (
                <CheckCircle size={18} />
              ) : (
                <Circle size={18} />
              )}
              {mode === "skip" ? "Skip Duplicates" : "Overwrite Duplicates"}
            </button>
          ))}
        </div>

        {/* File Upload UI */}
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <label className="flex-1 border-2 border-dashed border-slate p-4 text-center text-sm rounded-lg cursor-pointer hover:border-primary transition flex flex-col items-center gap-2">
            <ImagePlus size={24} />
            <p>Select individual photos</p>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          <label className="flex-1 border-2 border-dashed border-slate p-4 text-center text-sm rounded-lg cursor-pointer hover:border-primary transition flex flex-col items-center gap-2">
            <FolderOpen size={24} />
            <p>Select folder</p>
            <input
              type="file"
              accept="image/*"
              multiple
              webkitdirectory="true"
              mozdirectory="true"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>

        {/* File List */}
        {selectedFiles.length > 0 && (
          <div className="mb-4 max-h-48 overflow-y-auto border rounded p-2 bg-gray-50">
            {selectedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-1 px-2 hover:bg-gray-100 rounded"
              >
                <span className="text-sm text-gray-700 truncate max-w-xs">
                  {file.name}
                </span>
                <button
                  onClick={() => handleRemoveFile(index)}
                  className="text-red-500 hover:text-red-700 text-xs font-medium"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Upload Progress */}
        {uploading && (
          <div className="mb-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300 ease-in-out"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-700 mt-2 text-center">
              {uploadedCount} of {selectedFiles.length} images uploaded
            </p>
            <p className="text-xs text-center text-gray-500">
              Time left: {getTimeLeft()}
            </p>
          </div>
        )}

        {/* Footer Buttons */}
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500">
            {selectedFiles.length} file{selectedFiles.length !== 1 && "s"}{" "}
            selected
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleClose}
              className="px-4 py-2 rounded bg-slate text-gray-700 hover:bg-slate-dark transition"
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={selectedFiles.length === 0 || uploading}
              className="px-4 py-2 rounded bg-primary text-white hover:bg-primary-dark transition disabled:opacity-50"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPhotosModal;
