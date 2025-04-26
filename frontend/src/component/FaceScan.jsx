import React, { useState } from "react";
import axios from "axios";
import imageCompression from "browser-image-compression";
import { S3_API_END_POINT } from "../constant";
import apiRequest from "../utils/apiRequest";
import { useDispatch, useSelector } from "react-redux";

const FaceScan = () => {
  const [selfie, setSelfie] = useState(null);
  const [matchedImages, setMatchedImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const { accessToken } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        // Compress the image
        const options = {
          maxSizeMB: 1, // target max size (1MB)
          maxWidthOrHeight: 800, // max width or height
          useWebWorker: true,
        };

        const compressedFile = await imageCompression(file, options);

        // Convert compressed image to base64
        const reader = new FileReader();
        reader.onloadend = () => {
          setSelfie(reader.result.split(",")[1]); // Only base64 part
        };
        reader.readAsDataURL(compressedFile);
      } catch (error) {
        console.error("Error compressing image:", error);
        alert("Failed to compress image.");
      }
    }
  };

  const handleSearch = async () => {
    if (!selfie) {
      alert("Please upload a selfie first.");
      return;
    }

    try {
      setLoading(true);
      const endpoint = `${S3_API_END_POINT}/search-face`;
      const res = await apiRequest(
        "POST",
        endpoint,
        { imageBase64: selfie },
        accessToken,
        dispatch
      );

      console.log(res);

      // Assuming your backend sends `imageUrl` for each matched face
      setMatchedImages(res.data.matchedImages || []);
    } catch (error) {
      console.error("Face search failed:", error);
      alert("Failed to search face.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 flex flex-col items-center gap-6">
      <h1 className="text-3xl font-bold">Face Search 🔍</h1>

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="border p-2"
      />

      <button
        onClick={handleSearch}
        className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
        disabled={loading}
      >
        {loading ? "Searching..." : "Search Face"}
      </button>

      {matchedImages.length > 0 && (
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
          {matchedImages.map((img, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <img
                src={img.imageUrl} // Ensure your backend returns `imageUrl`
                alt="Matched face"
                className="w-40 h-40 object-cover rounded-lg shadow-md"
              />
              <span className="text-sm mt-2">
                {img.similarity?.toFixed(1)}% match
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FaceScan;
