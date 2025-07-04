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
  currentSubEvent,
}) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgresses, setUploadProgresses] = useState({});
  const [uploadStatuses, setUploadStatuses] = useState({});
  const [uploadedCount, setUploadedCount] = useState(0);
  const [cancelTokens, setCancelTokens] = useState([]);
  const [cancelRequested, setCancelRequested] = useState(false);
  const [showRefreshButton, setShowRefreshButton] = useState(false); // New state for refresh button

  const { currentEvent } = useSelector((state) => state.event);
  const { accessToken,authUser } = useSelector((state) => state.user);
  const { refetchImageCount } = useGetEventImagesCount(currentEvent?._id);
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
      for (let p = 5; p <= 50; p += 5) {
        await new Promise((res) => setTimeout(res, 20));
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

  const uploadFile = async (url, file, index, cancelToken) => {
    try {
      setUploadStatuses((prev) => ({ ...prev, [index]: "Uploading..." }));

      await axios.put(url, file, {
        headers: { "Content-Type": file.type },
        onUploadProgress: (e) => {
          const percent = Math.round((e.loaded * 70) / e.total);
          const progress = 50 + percent;
          setUploadProgresses((prev) => ({ ...prev, [index]: progress }));
        },
        cancelToken: cancelToken.token,
      });

      setUploadStatuses((prev) => ({ ...prev, [index]: "Completed ✅" }));
      setUploadProgresses((prev) => ({ ...prev, [index]: 100 }));
      setUploadedCount((prev) => prev + 1);
    } catch (err) {
      if (axios.isCancel(err)) {
        console.log(`Upload for ${file.name} was canceled`);
      } else {
        console.error("Upload failed:", err);
        setUploadStatuses((prev) => ({ ...prev, [index]: "Failed ❌" }));
        setUploadProgresses((prev) => ({ ...prev, [index]: -1 }));
      }
    }
  };

  // const processInPipeline = async (files) => {
  //   const BATCH_SIZE = 50;
  //   const MAX_CONCURRENT_UPLOADS = 5;

  //   setUploading(true);
  //   setUploadedCount(0);
  //   setCancelRequested(false);
  //   toast.loading("Uploading images...");

  //   try {
  //     for (let i = 0; i < files.length; i += BATCH_SIZE) {
  //       if (cancelRequested) break;
  //       const batch = files.slice(i, i + BATCH_SIZE);
  //       const uploadQueue = [...batch.entries()];
  //       const activeUploads = [];

  //       const startUpload = async ([batchIndex, file]) => {
  //         const globalIndex = i + batchIndex;
  //         if (cancelRequested) return;

  //         const cancelToken = axios.CancelToken.source();
  //         setCancelTokens((prev) => [...prev, cancelToken]);

  //         const compressed = await compressFile(file, globalIndex);
  //         if (!compressed || cancelRequested) return;

  //         try {
  //           const urlResponse = await apiRequest(
  //             "POST",
  //             `${S3_API_END_POINT}/get-presigned-url`,
  //             {
  //               eventId: currentEvent?._id,
  //               subEventId: currentSubEvent?._id,
  //               userId:authUser?._id,
  //               files: [
  //                 {
  //                   fileName: compressed.name,
  //                   fileType: compressed.type,
  //                   fileSize: compressed.size,
  //                 },
  //               ],
  //             },
  //             accessToken,
  //             dispatch
  //           );

  //           const url = urlResponse?.data?.urls?.[0]?.url;
  //           if (url && !cancelRequested) {
  //             await uploadFile(url, compressed, globalIndex, cancelToken);
  //           } else {
  //             setUploadStatuses((prev) => ({
  //               ...prev,
  //               [globalIndex]: "URL Error ❌",
  //             }));
  //             setUploadProgresses((prev) => ({ ...prev, [globalIndex]: -1 }));
  //           }
  //         } catch (err) {
  //           setUploadStatuses((prev) => ({
  //             ...prev,
  //             [globalIndex]: "URL Fetch Failed ❌",
  //           }));
  //           setUploadProgresses((prev) => ({ ...prev, [globalIndex]: -1 }));
  //         }
  //       };

  //       while (
  //         !cancelRequested &&
  //         (uploadQueue.length > 0 || activeUploads.length > 0)
  //       ) {
  //         while (
  //           !cancelRequested &&
  //           activeUploads.length < MAX_CONCURRENT_UPLOADS &&
  //           uploadQueue.length > 0
  //         ) {
  //           const promise = startUpload(uploadQueue.shift());
  //           activeUploads.push(promise);
  //           promise.finally(() => {
  //             const idx = activeUploads.indexOf(promise);
  //             if (idx !== -1) activeUploads.splice(idx, 1);
  //           });
  //         }

  //         if (activeUploads.length > 0) {
  //           await Promise.race(activeUploads);
  //         }
  //       }
  //     }

  //     if (!cancelRequested) {
  //       toast.dismiss();
  //       toast.success("Images uploaded ✅");
  //       onUploadSuccess?.(); // Trigger this to notify the parent to refresh images manually
  //       handleClose();
  //     }
  //   } catch (err) {
  //                 toast.error(err?.response?.data?.error)

  //     if (!cancelRequested) {
  //       console.error("Upload error:", err);
  //       toast.dismiss();
  //       toast.error("Upload failed ❌");
  //     }
  //   } finally {
  //     setUploading(false);
  //   }
  // };

  const processInPipeline = async (files) => {
  const BATCH_SIZE = 50;
  const MAX_CONCURRENT_UPLOADS = 5;

  setUploading(true);
  setUploadedCount(0);
  setCancelRequested(false);
  toast.loading("Uploading images...");

  let hasUploadFailure = false;

  try {
    for (let i = 0; i < files.length; i += BATCH_SIZE) {
      if (cancelRequested) break;

      const batch = files.slice(i, i + BATCH_SIZE);
      const uploadQueue = [...batch.entries()];
      const activeUploads = new Set();

      // const startUpload = async ([batchIndex, file]) => {
      //   const globalIndex = i + batchIndex;
      //   if (cancelRequested) return;

      //   const cancelToken = axios.CancelToken.source();
      //   setCancelTokens((prev) => [...prev, cancelToken]);

      //   const compressed = await compressFile(file, globalIndex);
      //   if (!compressed || cancelRequested) return;

      //   try {
      //     const urlResponse = await apiRequest(
      //       "POST",
      //       `${S3_API_END_POINT}/get-presigned-url`,
      //       {
      //         eventId: currentEvent?._id,
      //         subEventId: currentSubEvent?._id,
      //         userId: authUser?._id,
      //         files: [
      //           {
      //             fileName: compressed.name,
      //             fileType: compressed.type,
      //             size: compressed.size, // ✅ Correct key
      //           },
      //         ],
      //       },
      //       accessToken,
      //       dispatch
      //     );

      //     const url = urlResponse?.data?.urls?.[0]?.url;
      //     if (url && !cancelRequested) {
      //       await uploadFile(url, compressed, globalIndex, cancelToken);
      //     } else {
      //       hasUploadFailure = true;
      //       setUploadStatuses((prev) => ({
      //         ...prev,
      //         [globalIndex]: "URL Error ❌",
      //       }));
      //       setUploadProgresses((prev) => ({ ...prev, [globalIndex]: -1 }));
      //     }
      //   } catch (err) {
      //     hasUploadFailure = true;
      //             toast.error(err?.response?.data?.error ??   "Some uploads failed ❌");

      //     console.error("Upload URL error:", err?.response || err);
      //     setUploadStatuses((prev) => ({
      //       ...prev,
      //       [globalIndex]: "URL Fetch Failed ❌",
      //     }));
      //     setUploadProgresses((prev) => ({ ...prev, [globalIndex]: -1 }));
      //   }
      // };
      const startUpload = async ([batchIndex, file]) => {
  const globalIndex = i + batchIndex;
  if (cancelRequested) return;

  const cancelToken = axios.CancelToken.source();
  setCancelTokens((prev) => [...prev, cancelToken]);

  // Compress for original
  const originalCompressed = await compressFile(file, globalIndex);
  if (!originalCompressed || cancelRequested) return;

  // ✅ Create thumbnail version
  const thumbnailCompressed = await imageCompression(file, {
    maxSizeMB: 0.2,
    maxWidthOrHeight: 300,
    useWebWorker: true,
  });

  if (!thumbnailCompressed || cancelRequested) return;

  try {
    // Step 1: Get presigned URLs for both original and thumbnail
    const urlResponse = await apiRequest(
      "POST",
      `${S3_API_END_POINT}/get-presigned-url`,
      {
        eventId: currentEvent?._id,
        subEventId: currentSubEvent?._id,
        userId: authUser?._id,
        files: [
          {
            fileName: originalCompressed.name,
            fileType: originalCompressed.type,
            size: originalCompressed.size,
            path: "Original", // 👈 specify path for backend
          },
          {
            fileName: originalCompressed.name, // same name
            fileType: thumbnailCompressed.type,
            size: thumbnailCompressed.size,
            path: "Thumb", // 👈 thumbnail path for backend
          },
        ],
      },
      accessToken,
      dispatch
    );

    const urls = urlResponse?.data?.urls || [];
    const originalUrl = urls.find((u) => u.key.includes("/Original/"))?.url;
    const thumbUrl = urls.find((u) => u.key.includes("/Thumb/"))?.url;

    if (!originalUrl || !thumbUrl) {
      hasUploadFailure = true;
      setUploadStatuses((prev) => ({
        ...prev,
        [globalIndex]: "URL Missing ❌",
      }));
      setUploadProgresses((prev) => ({ ...prev, [globalIndex]: -1 }));
      return;
    }

    // Step 2: Upload both
    await uploadFile(originalUrl, originalCompressed, globalIndex, cancelToken);
    await uploadFile(thumbUrl, thumbnailCompressed, globalIndex, cancelToken);

  } catch (err) {
    hasUploadFailure = true;
    toast.error(err?.response?.data?.error ?? "Some uploads failed ❌");

    setUploadStatuses((prev) => ({
      ...prev,
      [globalIndex]: "Upload failed ❌",
    }));
    setUploadProgresses((prev) => ({ ...prev, [globalIndex]: -1 }));
  }
};


      while (!cancelRequested && (uploadQueue.length > 0 || activeUploads.size > 0)) {
        while (
          !cancelRequested &&
          activeUploads.size < MAX_CONCURRENT_UPLOADS &&
          uploadQueue.length > 0
        ) {
          const uploadTask = startUpload(uploadQueue.shift());
          activeUploads.add(uploadTask);

          uploadTask.finally(() => {
            activeUploads.delete(uploadTask);
          });
        }

        if (activeUploads.size > 0) {
          await Promise.race(activeUploads);
        }
      }
    }

    toast.dismiss();

    if (!cancelRequested) {
      if (hasUploadFailure) {
        toast.error(err?.response?.data?.error ??   "Some uploads failed ❌");
      } else {
        toast.success("Images uploaded successfully ✅");
        onUploadSuccess?.();
        handleClose();
      }
    }
  } catch (err) {
    toast.dismiss();
    if (!cancelRequested) {
      toast.error(err?.response?.data?.error || "Upload failed ❌");
      console.error("Pipeline error:", err);
    }
  } finally {
    setUploading(false);
  }
};


  const handleRefreshImages = () => {
    refetchImageCount();
    setShowRefreshButton(false); // Hide the refresh button after the refresh
  };

  const handleClose = () => {
    setCancelRequested(true);
    cancelTokens.forEach((cancelToken) => cancelToken.cancel());
    setSelectedFiles([]);
    setUploadProgresses({});
    setUploadStatuses({});
    setUploadedCount(0);
    setUploading(false);
    setCancelTokens([]);
    onClose();
  };

  const getTotalSize = (files) => {
    const totalBytes = files.reduce((sum, file) => sum + file.size, 0);
    const totalMB = totalBytes / (1024 * 1024);
    return totalMB >= 1024
      ? `${(totalMB / 1024).toFixed(2)} GB`
      : `${totalMB.toFixed(2)} MB`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center overflow-x-hidden">
      <div className="bg-white rounded-xl px-6 py-10 w-[95%] max-w-2xl shadow-2xl relative animate-fadeIn flex flex-col gap-4 overflow-x-hidden">
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
            <div className="mb-4 max-h-64 overflow-y-auto overflow-x-hidden border rounded p-2 bg-gray-50">
              {selectedFiles.map((file, index) => (
                <div key={index} className="mb-2 w-full">
                  <div className="flex justify-between items-center gap-2 overflow-hidden">
                    <span className="text-sm break-all truncate max-w-[80%]">
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
                        style={{ width: `${uploadProgresses[index] || 5}%` }}
                      ></div>
                    </div>
                  )}
                  {uploadStatuses[index] && (
                    <div className="text-xs text-gray-500 mt-1">
                      {uploadStatuses[index]}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <button
              onClick={() => processInPipeline(selectedFiles)}
              className="bg-primary text-white py-2 rounded-lg hover:bg-primary-dark transition w-full"
              disabled={uploading}
            >
              {uploading
                ? `Uploading (${uploadedCount}/${selectedFiles.length})`
                : "Start Upload"}
            </button>
          </>
        )}

        {/* Add the Refresh button */}
        {showRefreshButton && (
          <button
            onClick={handleRefreshImages}
            className="bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 mt-4 w-full"
          >
            Refresh Images
          </button>
        )}
      </div>
    </div>
  );
};

export default AddPhotosModal;
