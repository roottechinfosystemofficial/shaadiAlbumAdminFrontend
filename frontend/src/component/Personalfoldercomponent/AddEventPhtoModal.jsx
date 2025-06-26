import React, { useState, useRef } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import imageCompression from "browser-image-compression";
import { X, ImagePlus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { EVENT_API_END_POINT } from "../../constant";
import toast from "../../utils/toast";
import apiRequest from "../../utils/apiRequest";
import { useGetEventImagesCount } from "../../Hooks/useGetEventImagesCount";
import { setCoverImg } from "../../Redux/Slices/CoverImgSlice";
import { setEventImage } from "../../Redux/Slices/EventSlice";

const AddEventPhotoModal = ({
  isOpen,
  onClose,
  onUploadSuccess,
}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const cropperRef = useRef(null);

  const { currentEvent } = useSelector((state) => state.event);
  const { accessToken } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  useGetEventImagesCount(currentEvent?._id); // side effect hook

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const getCroppedImageBlob = () => {
    const cropper = cropperRef.current?.cropper;
    if (!cropper) throw new Error("Cropper not ready");

    const canvas = cropper.getCroppedCanvas({
      maxWidth: 1920,
      maxHeight: 1920,
      imageSmoothingEnabled: true,
      imageSmoothingQuality: 'high',
    });

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) reject(new Error("Failed to create blob"));
        else resolve(blob);
      }, "image/jpeg");
    });
  };

  const uploadCroppedImage = async () => {
    if (!previewUrl || !selectedFile) {
      toast.error("Image not selected or cropper not ready");
      return;
    }

    try {
      setUploading(true);
      toast.loading("Uploading cropped image...");

      const croppedBlob = await getCroppedImageBlob();

      const compressed = await imageCompression(croppedBlob, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      });

      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(compressed);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (err) => reject(err);
      });

      const response = await apiRequest(
        "POST",
        `${EVENT_API_END_POINT}/upload-image/${currentEvent?._id}`,
        {
          fileType: compressed.type,
          base64Image: base64,
        },
        accessToken,
        dispatch
      );

      const imageUrl = response?.data?.imageUrl;
      if (imageUrl) {
        dispatch(setCoverImg(imageUrl));
        dispatch(setEventImage(imageUrl));
        toast.dismiss();
        toast.success("Image uploaded ✅");
        onUploadSuccess?.();
        handleClose();
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.dismiss();
      toast.error("Upload failed ❌");
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    setUploading(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center overflow-auto p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl shadow-lg p-6 relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Upload and Crop Photo</h2>
          <button onClick={handleClose} className="text-gray-500 hover:text-red-500">
            <X />
          </button>
        </div>

        {!previewUrl ? (
          <label className="border-2 border-dashed border-gray-300 p-6 w-full text-center rounded-lg cursor-pointer hover:border-indigo-500">
            <ImagePlus className="mx-auto mb-2" size={28} />
            <p className="text-sm">Click to select image</p>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        ) : (
          <>
            <div className="relative w-full h-[500px] bg-gray-100 rounded-lg overflow-hidden mb-4">
              <Cropper
                ref={cropperRef}
                src={previewUrl}
                style={{ height: 500, width: "100%" }}
                aspectRatio={1}
                guides={true}
                movable={true}
                zoomable={true}
                responsive={true}
                viewMode={1}
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={handleClose}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={uploadCroppedImage}
                disabled={uploading}
                className={`${
                  uploading ? "bg-indigo-300 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
                } text-white px-4 py-2 rounded`}
              >
                {uploading ? "Uploading..." : "Upload"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AddEventPhotoModal;
