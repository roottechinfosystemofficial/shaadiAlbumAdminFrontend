import React, { useState } from "react";
import axios from "axios";
import { X, CheckCircle, Circle, FolderOpen, ImagePlus } from "lucide-react";

const AddPhotosModal = ({ isOpen, onClose }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [duplicateHandling, setDuplicateHandling] = useState("skip");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles((prev) => [...prev, ...files]);
  };

  const handleRemoveFile = (index) => {
    const updated = [...selectedFiles];
    updated.splice(index, 1);
    setSelectedFiles(updated);
  };

  const handleDuplicateOption = (mode) => {
    setDuplicateHandling(mode);
  };

  const handleUpload = async () => {
    setUploading(true);
    setUploadProgress(0);

    let progressPerFile = 100 / selectedFiles.length;

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];

      try {
        // 1. Get presigned URL
        const { data } = await axios.get(
          "http://localhost:5000/api/v1/api/s3/get-presigned-url",
          {
            params: {
              fileName: file.name,
              fileType: file.type,
            },
          }
        );

        // 2. Upload to S3
        await axios.put(data.url, file, {
          headers: {
            "Content-Type": file.type,
          },
        });

        // 3. Update progress
        setUploadProgress((prev) => prev + progressPerFile);
      } catch (err) {
        console.error("Upload failed for:", file.name, err);
      }
    }

    setUploading(false);
    setSelectedFiles([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-xl px-6 py-10 w-[95%] max-w-2xl shadow-2xl relative animate-fadeIn flex flex-col gap-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Upload Photos</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500"
          >
            <X />
          </button>
        </div>

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

        {uploading && (
          <div className="mb-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-500 text-center mt-2">
              {uploadProgress.toFixed(0)}% Uploading...
            </p>
          </div>
        )}

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
