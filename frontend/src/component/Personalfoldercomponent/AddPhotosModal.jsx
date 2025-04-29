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

  const compressFile = async (file) => {
    try {
      return await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      });
    } catch (err) {
      console.error("Compression failed:", err);
      return null;
    }
  };

  const uploadFile = async (url, file, index) => {
    try {
      await axios.put(url, file, {
        headers: { "Content-Type": file.type },
        onUploadProgress: (e) => {
          const progress = Math.round((e.loaded * 100) / e.total);
          setUploadProgresses((prev) => ({ ...prev, [index]: progress }));
        },
      });
      setUploadedCount((prev) => prev + 1);
    } catch (err) {
      console.error("Upload failed:", err);
      setUploadProgresses((prev) => ({ ...prev, [index]: -1 }));
    }
  };

  const uploadBatchSequentially = async () => {
    setUploading(true);
    setUploadedCount(0);
    toast.loading("Uploading images...");

    const batchSize = 10;
    const queue = [];

    try {
      await Promise.all(
        selectedFiles.map(async (file, index) => {
          const compressed = await compressFile(file);
          if (!compressed) return;

          const res = await apiRequest(
            "POST",
            `${S3_API_END_POINT}/get-presigned-url`,
            {
              eventId: singleEvent?._id,
              subEventId: selectedSubEvent?._id,
              files: [
                {
                  fileName: compressed.name,
                  fileType: compressed.type,
                  fileSize: compressed.size,
                },
              ],
            },
            accessToken,
            dispatch
          );

          const url = res?.data?.urls?.[0]?.url;
          if (!url) return;

          queue.push({ file: compressed, url, index });

          if (queue.length >= batchSize) {
            const currentBatch = queue.splice(0, batchSize);
            await Promise.all(
              currentBatch.map(({ file, url, index }) =>
                uploadFile(url, file, index)
              )
            );
          }
        })
      );

      // Upload remaining
      if (queue.length > 0) {
        await Promise.all(
          queue.map(({ file, url, index }) => uploadFile(url, file, index))
        );
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

  const handleClose = () => {
    setSelectedFiles([]);
    setUploadProgresses({});
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
          <div className="mb-4 max-h-48 overflow-y-auto border rounded p-2 bg-gray-50">
            {selectedFiles.map((file, index) => (
              <div key={index} className="mb-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm truncate max-w-xs">{file.name}</span>
                  <button
                    onClick={() => handleRemoveFile(index)}
                    className="text-xs text-red-500"
                  >
                    Remove
                  </button>
                </div>
                {uploading && (
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        uploadProgresses[index] === -1
                          ? "bg-red-500 w-full"
                          : "bg-primary"
                      }`}
                      style={{ width: `${uploadProgresses[index] || 0}%` }}
                    ></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {uploading && (
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
            onClick={uploadBatchSequentially}
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
