import React, { useState } from "react";
import axios from "axios";
import imageCompression from "browser-image-compression";
import { X, FolderOpen, ImagePlus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { S3_API_END_POINT } from "../../constant";
import toast from "../../utils/toast";
import apiRequest from "../../utils/apiRequest";
import { useGetEventImagesCount } from "../../Hooks/useGetEventImagesCount";

const AddPhotosModal = ({
  isOpen,
  onClose,
  onUploadSuccess,
  selectedSubEvent,
}) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgresses, setUploadProgresses] = useState({});
  const [uploadStatuses, setUploadStatuses] = useState({});
  const [uploadedCount, setUploadedCount] = useState(0);
  const { singleEvent } = useSelector((state) => state.event);
  const { accessToken } = useSelector((state) => state.user);
  const { refetchImageCount } = useGetEventImagesCount(singleEvent?._id);
  const dispatch = useDispatch();

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

  const compressFile = async (file, index) => {
    try {
      setUploadStatuses((prev) => ({ ...prev, [index]: "Preparing..." }));

      // Simulate progress to 30%
      for (let p = 5; p <= 50; p += 5) {
        await new Promise((res) => setTimeout(res, 50));
        setUploadProgresses((prev) => ({ ...prev, [index]: p }));
      }

      const compressed = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      });

      return compressed;
    } catch (err) {
      console.error("Compression failed:", err);
      setUploadStatuses((prev) => ({ ...prev, [index]: "Failed" }));
      return null;
    }
  };

  const uploadFile = async (url, file, index) => {
    try {
      setUploadStatuses((prev) => ({ ...prev, [index]: "Uploading..." }));
      await axios.put(url, file, {
        headers: { "Content-Type": file.type },
        onUploadProgress: (e) => {
          const percent = Math.round((e.loaded * 70) / e.total); // 0–70 range
          const progress = 50 + percent; // map to 30–100
          setUploadProgresses((prev) => ({ ...prev, [index]: progress }));
        },
      });
      setUploadStatuses((prev) => ({ ...prev, [index]: "Completed ✅" }));
      setUploadProgresses((prev) => ({ ...prev, [index]: 100 }));
      setUploadedCount((prev) => prev + 1);
    } catch (err) {
      console.error("Upload failed:", err);
      setUploadStatuses((prev) => ({ ...prev, [index]: "Failed ❌" }));
      setUploadProgresses((prev) => ({ ...prev, [index]: -1 }));
    }
  };

  const processInPipeline = async (files, batchSize = 5) => {
    setUploading(true);
    setUploadedCount(0);
    toast.loading("Uploading images...");

    try {
      // Step 1: Compress and upload images progressively
      const uploadPromises = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Compress the image
        const compressedFile = await compressFile(file, i);
        if (compressedFile) {
          // Get presigned URL for this image
          const urlResponse = await apiRequest(
            "POST",
            `${S3_API_END_POINT}/get-presigned-url`,
            {
              eventId: singleEvent?._id,
              subEventId: selectedSubEvent?._id,
              files: [
                {
                  fileName: compressedFile.name,
                  fileType: compressedFile.type,
                  fileSize: compressedFile.size,
                },
              ],
            },
            accessToken,
            dispatch
          );

          const url = urlResponse?.data?.urls?.[0]?.url;
          if (url) {
            // Upload the file concurrently as soon as it's compressed
            const uploadPromise = uploadFile(url, compressedFile, i);
            uploadPromises.push(uploadPromise);
          }
        }

        // Limit concurrency based on batchSize
        if (uploadPromises.length >= batchSize) {
          await Promise.all(uploadPromises); // Wait for the current batch to complete
          uploadPromises.length = 0; // Reset batch for the next group of images
        }
      }

      // Wait for any remaining uploads
      if (uploadPromises.length > 0) {
        await Promise.all(uploadPromises);
      }

      await refetchImageCount();
      toast.dismiss();
      toast.success("Images uploaded ✅");
      onUploadSuccess?.();
      handleClose();
    } catch (err) {
      console.error("Upload error:", err);
      toast.dismiss();
      toast.error("Upload failed ❌");
    } finally {
      setUploading(false);
    }
  };

  const getTotalSize = (files) => {
    const totalBytes = files.reduce((sum, file) => sum + file.size, 0);
    const totalMB = totalBytes / (1024 * 1024);
    return totalMB >= 1024
      ? `${(totalMB / 1024).toFixed(2)} GB`
      : `${totalMB.toFixed(2)} MB`;
  };

  const handleClose = () => {
    setSelectedFiles([]);
    setUploadProgresses({});
    setUploadStatuses({});
    setUploadedCount(0);
    setUploading(false);
    onClose();
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
          <>
            <div className="text-sm text-gray-700 mb-2">
              Selected {selectedFiles.length} files (
              {getTotalSize(selectedFiles)})
            </div>
            <div className="mb-4 max-h-64 overflow-y-auto border rounded p-2 bg-gray-50">
              {selectedFiles.map((file, index) => (
                <div key={index} className="mb-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm truncate max-w-xs">
                      {file.name}
                    </span>
                    {!uploading && (
                      <button
                        onClick={() => handleRemoveFile(index)}
                        className="text-xs text-red-500"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  {uploading && (
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          uploadProgresses[index] === -1
                            ? "bg-red-500 w-full"
                            : "bg-primary"
                        }`}
                        style={{
                          width: `${uploadProgresses[index] || 5}%`,
                        }}
                      ></div>
                    </div>
                  )}
                  {uploading && (
                    <p className="text-xs text-gray-500 mt-1">
                      {uploadStatuses[index] || "Queued..."}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {uploading && selectedFiles.length > 0 && (
          <p className="text-sm text-gray-600 text-right">
            Uploaded {uploadedCount} of {selectedFiles.length} images
          </p>
        )}

        <div className="flex justify-between items-center gap-4">
          <button
            onClick={handleClose}
            className="w-full sm:w-auto border border-gray-300 text-gray-700 px-6 py-2 rounded-lg"
            disabled={uploading}
          >
            Cancel
          </button>
          <button
            onClick={() => processInPipeline(selectedFiles)}
            className="w-full sm:w-auto bg-primary text-white px-6 py-2 rounded-lg disabled:opacity-50"
            disabled={uploading || selectedFiles.length === 0}
          >
            {uploading ? "Uploading..." : "Start Upload"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddPhotosModal;
