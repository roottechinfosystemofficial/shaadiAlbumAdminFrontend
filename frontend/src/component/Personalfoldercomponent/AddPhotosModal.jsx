import React, { useState } from "react";
import { X, CheckCircle, Circle, FolderOpen, ImagePlus } from "lucide-react";

const AddPhotosModal = ({ isOpen, onClose }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [duplicateHandling, setDuplicateHandling] = useState("skip");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  if (!isOpen) return null;

  // Handle file input change (individual files or folder)
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles((prev) => [...prev, ...files]);
  };

  // Handle removing files from the selected list
  const handleRemoveFile = (index) => {
    const updated = [...selectedFiles];
    updated.splice(index, 1);
    setSelectedFiles(updated);
  };

  // Simulate file upload process and update progress
  const simulateUpload = () => {
    setUploading(true);
    let progress = 0;

    // Simulate progress update
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);

      if (progress >= 100) {
        clearInterval(interval);
        setUploading(false); // Upload complete
        onClose(); // Close modal after upload
      }
    }, 500); // Simulate a 500ms interval between progress increments
  };

  // Handle the upload action (trigger progress simulation)
  const handleUpload = () => {
    console.log("Uploading files:", selectedFiles);
    console.log("Duplicate mode:", duplicateHandling);
    setSelectedFiles([]);
    simulateUpload(); // Simulate file upload
  };

  // Handle selecting duplicate options (skip or overwrite)
  const handleDuplicateOption = (mode) => {
    setDuplicateHandling(mode);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-xl px-6 py-10 w-[95%] max-w-2xl shadow-2xl relative animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Upload Photos</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500"
          >
            <X />
          </button>
        </div>

        {/* Upload Options */}
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          {/* Select Files */}
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

          {/* Select Folder */}
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

        {/* Duplicate Handling Options */}
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => handleDuplicateOption("skip")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border transition ${
              duplicateHandling === "skip"
                ? "bg-primary text-white border-primary"
                : "bg-gray-100 border-gray-300 text-gray-700"
            }`}
          >
            {duplicateHandling === "skip" ? (
              <CheckCircle size={18} />
            ) : (
              <Circle size={18} />
            )}
            Skip Duplicates
          </button>
          <button
            onClick={() => handleDuplicateOption("overwrite")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border transition ${
              duplicateHandling === "overwrite"
                ? "bg-primary text-white border-primary"
                : "bg-gray-100 border-gray-300 text-gray-700"
            }`}
          >
            {duplicateHandling === "overwrite" ? (
              <CheckCircle size={18} />
            ) : (
              <Circle size={18} />
            )}
            Overwrite Duplicates
          </button>
        </div>

        {/* File Name List */}
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

        {/* Progress Bar */}
        {uploading && (
          <div className="mb-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-500 text-center mt-2">
              {uploadProgress}% Uploading...
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500">
            {selectedFiles.length} file{selectedFiles.length !== 1 && "s"}{" "}
            selected
          </p>
          <div className="flex gap-2">
            <button
              onClick={onClose}
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
