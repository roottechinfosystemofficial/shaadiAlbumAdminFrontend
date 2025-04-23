import React, { useState } from "react";
import axios from "axios";
import { X, CheckCircle, Circle, FolderOpen, ImagePlus } from "lucide-react";
import { useSelector } from "react-redux";

const AddPhotosModal = ({ isOpen, onClose, onUploadSuccess }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [duplicateHandling, setDuplicateHandling] = useState("skip");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedCount, setUploadedCount] = useState(0);
  const { singleEvent } = useSelector((state) => state.event);
  const [uploadStartTime, setUploadStartTime] = useState(null);

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

  // Function to upload a batch of files to S3
  const uploadBatchToS3 = async (files) => {
    console.log(files);

    const { data } = await axios.post(
      "http://localhost:5000/api/v1/api/s3/get-presigned-url",
      {
        eventId: singleEvent?._id,
        files: files.map(({ fileName, fileType }) => ({
          fileName,
          fileType,
        })),
      }
    );

    // Upload the batch of files in parallel
    const uploadPromises = files.map((file, index) =>
      uploadFile(data.urls[index].url, file)
    );

    await Promise.all(uploadPromises);
  };

  const uploadFile = async (url, file) => {
    try {
      await axios.put(url, file, {
        headers: { "Content-Type": file.type },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(progress);
        },
      });

      setUploadedCount((count) => {
        const newCount = count + 1;
        setUploadProgress((newCount / selectedFiles.length) * 100);
        return newCount;
      });
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleUpload = async () => {
    setUploading(true);
    setUploadProgress(0);
    setUploadedCount(0);

    // Batch the files in groups of 50 for uploading
    const batchSize = 50; // Adjust batch size based on your preference
    const uploadBatch = [];

    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];

        // Add the current file to the upload batch
        uploadBatch.push({
          file: file,
          fileName: file.name,
          fileType: file.type,
        });

        // Once the batch is filled, upload it
        if (uploadBatch.length >= batchSize || i === selectedFiles.length - 1) {
          // Upload the current batch to S3
          await uploadBatchToS3(uploadBatch);

          // Clear the current batch and reset progress for the next batch
          uploadBatch.length = 0;
        }
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
          <label className="flex-1 border-2 border-dashed border-slate p-4 text-center text-sm rounded-lg cursor-pointer hover:border-primary">
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
          <label className="flex-1 border-2 border-dashed border-slate p-4 text-center text-sm rounded-lg cursor-pointer hover:border-primary">
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
              Uploading images...
            </p>
          </div>
        )}

        <div className="flex justify-between items-center gap-4">
          <button
            onClick={handleClose}
            className="w-full sm:w-auto border border-gray-300 text-gray-700 px-6 py-2 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            className="w-full sm:w-auto bg-primary text-white px-6 py-2 rounded-lg"
            disabled={uploading || selectedFiles.length === 0}
          >
            Start Upload
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddPhotosModal;
