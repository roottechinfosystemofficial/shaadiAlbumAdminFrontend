import React, { useState } from "react";
import axios from "axios";
import imageCompression from "browser-image-compression";
import { X, ImagePlus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { S3_API_END_POINT } from "../../constant";
import toast from "../../utils/toast";
import apiRequest from "../../utils/apiRequest";
import { useGetEventImagesCount } from "../../Hooks/useGetEventImagesCount";
import { setCoverImg } from "../../Redux/Slices/CoverImgSlice";

const AddSinglePhotoModal = ({
  isOpen,
  onClose,
  onUploadSuccess,
  currentSubEvent,
}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState("");
  const [cancelToken, setCancelToken] = useState(null);

  const { currentEvent } = useSelector((state) => state.event);
  const { accessToken } = useSelector((state) => state.user);
  const { refetchImageCount } = useGetEventImagesCount(currentEvent?._id);
  const dispatch = useDispatch();

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const compressFile = async (file) => {
    try {
      setUploadStatus("Preparing...");
      for (let p = 5; p <= 50; p += 5) {
        await new Promise((res) => setTimeout(res, 20));
        setUploadProgress(p);
      }

      const compressed = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      });

      return compressed;
    } catch (err) {
      console.error("Compression failed:", err);
      setUploadStatus("Compression Failed ❌");
      return null;
    }
  };

//   const uploadFile = async (url, file) => {
//     try {
//       setUploadStatus("Uploading...");
//       await axios.put(url, file, {
//         // headers: { "Content-Type": file.type },
//         headers: {
//             "Content-Type": file.type, // file.type must match fileType on backend exactly
//           },
//         onUploadProgress: (e) => {
//           const percent = Math.round((e.loaded * 70) / e.total);
//           setUploadProgress(50 + percent);
//         },
//         cancelToken: cancelToken?.token,
//       });
//       console.log("cancel token",cancelToken)

//       setUploadStatus("Completed ✅");
//       setUploadProgress(100);
//     } catch (err) {
//       if (axios.isCancel(err)) {
//         console.log("Upload canceled");
//         setUploadStatus("Canceled");
//       } else {
//         console.error("Upload failed:", err);
//         setUploadStatus("Upload Failed ❌");
//         setUploadProgress(-1);
//       }
//     }
//   };

const uploadFile = async (url, file) => {
    try {
      console.log("Uploading:", file.name, file.type, file.size);
  
      const res = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });
  
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Upload failed: ${res.status} - ${errorText}`);
      }
  
      console.log("✅ Upload successful");
    } catch (err) {
      console.error("❌ Upload failed", err.message);
    }
  };
  const setCoverImageByFetching=async()=>{
    try {
      const response = await apiRequest(
        'GET',
        `${S3_API_END_POINT}/cover-image?eventId=${currentEvent?._id}&subEventId=${currentSubEvent?._id}`
      );
      dispatch(setCoverImg(response.data.url))
      
      console.log(response.data.url)

    }
    catch(error){
      console.log("cover image tab error",error)

    }

  }

  const processUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    toast.loading("Uploading image...");
    const cancelSource = axios.CancelToken.source();
    setCancelToken(cancelSource);

    try {
      const compressed = await compressFile(selectedFile);
      if (!compressed) return;

      const urlResponse = await apiRequest(
        "POST",
        `${S3_API_END_POINT}/get-presigned-url`,
        {
          eventId: currentEvent?._id,
          subEventId: currentSubEvent?._id,
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

      const url = urlResponse?.data?.urls?.[0]?.url;
      if (url) {
        await uploadFile(url, compressed);
        toast.dismiss();
        toast.success("Image uploaded ✅");
        dispatch(setCoverImg(url))
        onUploadSuccess?.();
        handleClose();
        await setCoverImageByFetching()
        
      } else {
        setUploadStatus("URL Error ❌");
      }
    } catch (err) {
      console.error(err);
      toast.dismiss();
      toast.error("Upload failed ❌");
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    cancelToken?.cancel();
    setSelectedFile(null);
    setUploadProgress(0);
    setUploadStatus("");
    setUploading(false);
    onClose();
  };

  const getFileSize = (file) => {
    const sizeMB = file.size / (1024 * 1024);
    return `${sizeMB.toFixed(2)} MB`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center overflow-x-hidden">
      <div className="bg-white rounded-xl px-6 py-10 w-[95%] max-w-2xl shadow-2xl relative animate-fadeIn flex flex-col gap-4 overflow-x-hidden">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Upload Photo</h2>
          <button onClick={handleClose} className="text-gray-500 hover:text-red-500">
            <X />
          </button>
        </div>

        <label className="border-2 border-dashed border-slate p-4 text-center text-sm rounded-lg cursor-pointer hover:border-primary">
          <ImagePlus size={24} />
          <p>Select photo</p>
          <input
            type="file"
            accept="image/*"
            multiple={false}
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        {selectedFile && (
          <div className="mt-4 space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="truncate max-w-[80%]">{selectedFile.name}</span>
              <span className="text-gray-500">{getFileSize(selectedFile)}</span>
            </div>
            {uploading && (
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    uploadProgress === -1 ? "bg-red-500 w-full" : "bg-primary"
                  }`}
                  style={{ width: `${uploadProgress || 5}%` }}
                ></div>
              </div>
            )}
            {uploadStatus && (
              <div className="text-xs text-gray-500">{uploadStatus}</div>
            )}
            {!uploading && (
              <button
                onClick={() => setSelectedFile(null)}
                className="text-xs text-red-500"
              >
                Remove
              </button>
            )}
            <button
              onClick={processUpload}
              className="bg-primary text-white py-2 rounded-lg hover:bg-primary-dark transition w-full"
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Start Upload"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddSinglePhotoModal;
