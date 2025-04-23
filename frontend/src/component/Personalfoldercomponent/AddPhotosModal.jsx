import React, { useState } from "react";
import axios from "axios";
import imageCompression from "browser-image-compression";
import { X, CheckCircle, Circle, FolderOpen, ImagePlus } from "lucide-react";
import { useSelector } from "react-redux";

const BATCH_SIZE = 100;
const CONCURRENCY_LIMIT = 5;

const AddPhotosModal = ({ isOpen, onClose, onUploadSuccess }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [duplicateHandling, setDuplicateHandling] = useState("skip");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedCount, setUploadedCount] = useState(0);
  const [uploadStartTime, setUploadStartTime] = useState(null);
  const [compressionProgress, setCompressionProgress] = useState(0);
  const { singleEvent } = useSelector((state) => state.event);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles((prev) => [...prev, ...files]);
  };

  const handleClose = () => {
    setSelectedFiles([]);
    setUploadProgress(0);
    setUploadedCount(0);
    setUploading(false);
    onClose();
  };

  const handleRemoveFile = (index) => {
    const updated = [...selectedFiles];
    updated.splice(index, 1);
    setSelectedFiles(updated);
  };

  const handleDuplicateOption = (mode) => {
    setDuplicateHandling(mode);
  };

  const getTimeLeft = () => {
    if (!uploadStartTime || uploadedCount === 0) return "Calculating...";
    const elapsed = (Date.now() - uploadStartTime) / 1000;
    const avgTime = elapsed / uploadedCount;
    const remaining = (selectedFiles.length - uploadedCount) * avgTime;
    const mins = Math.floor(remaining / 60);
    const secs = Math.floor(remaining % 60);
    return `${mins}m ${secs}s`;
  };

  const compressBatch = async (batch, index) => {
    const result = [];
    for (let file of batch) {
      const compressed = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      });
      result.push({
        file: compressed,
        fileName: compressed.name,
        fileType: compressed.type,
      });
      // Update compression progress based on batch completion
      setCompressionProgress(((index + 1) / selectedFiles.length) * 100);
    }
    return result;
  };

  const handleUpload = async () => {
    setUploading(true);
    setUploadProgress(0);
    setUploadedCount(0);
    setUploadStartTime(Date.now());

    try {
      for (let i = 0; i < selectedFiles.length; i += BATCH_SIZE) {
        const fileBatch = selectedFiles.slice(i, i + BATCH_SIZE);
        const compressedList = await compressBatch(fileBatch, i);

        // Notify that compression is complete and proceed to uploading
        setCompressionProgress(100);

        const { data } = await axios.post(
          "http://localhost:5000/api/v1/api/s3/get-presigned-url",
          {
            eventId: singleEvent?._id,
            files: compressedList.map(({ fileName, fileType }) => ({
              fileName,
              fileType,
            })),
          }
        );

        const uploadFile = async (url, file) => {
          await axios.put(url, file, {
            headers: { "Content-Type": file.type },
          });
          setUploadedCount((count) => {
            const newCount = count + 1;
            setUploadProgress((newCount / selectedFiles.length) * 100);
            return newCount;
          });
        };

        let index = 0;
        const startNext = async () => {
          if (index >= compressedList.length) return;
          const currentIndex = index++;
          await uploadFile(
            data.urls[currentIndex].url,
            compressedList[currentIndex].file
          );
          await startNext();
        };

        await Promise.all(
          new Array(CONCURRENCY_LIMIT).fill(null).map(() => startNext())
        );
      }

      setUploading(false);
      setSelectedFiles([]);
      onUploadSuccess();
      handleClose();
    } catch (err) {
      console.error("Upload error:", err);
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-xl px-6 py-10 w-[95%] max-w-2xl shadow-2xl relative animate-fadeIn flex flex-col gap-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Upload Photos</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-red-500"
          >
            <X />
          </button>
        </div>

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
            <div className="mt-2 text-center">
              <p className="text-sm text-gray-600">
                Compression Progress: {Math.round(compressionProgress)}%
              </p>
            </div>
          </div>
        )}

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
