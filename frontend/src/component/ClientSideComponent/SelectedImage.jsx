import React, { useEffect } from "react";
import { X, Download } from "lucide-react";
import ModalPortal from "./ModalPortal";

const SelectedImage = ({ selectedImage, setSelectedImage }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setSelectedImage(null);
      }
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [setSelectedImage]);

  const handleClickOutside = (e) => {
    if (e.target.id === "modal-bg") {
      setSelectedImage(null);
    }
  };

  const handleDownload = async () => {
    if (!selectedImage?.originalUrl) return;

    try {
      const response = await fetch(selectedImage.originalUrl, {
        mode: "cors",
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = selectedImage.filename || "image.jpg";
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed:", err);
      alert("Failed to download image. CORS or network error.");
    }
  };

  return (
    <ModalPortal>
      <div
        id="modal-bg"
        onClick={handleClickOutside}
        className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center"
      >
        <div className="absolute top-4 right-4 flex gap-x-2">
          <button
            onClick={handleDownload}
            className="bg-white p-2 rounded-full shadow hover:bg-gray-100 z-50"
            aria-label="Download Image"
          >
            <Download className="w-5 h-5 text-black" />
          </button>
          <button
            onClick={() => setSelectedImage(null)}
            className="bg-white p-2 rounded-full shadow hover:bg-gray-100 z-50"
            aria-label="Close Modal"
          >
            <X className="w-5 h-5 text-black" />
          </button>
        </div>

        <img
          src={selectedImage?.originalUrl}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              "https://via.placeholder.com/800x600?text=Image+Not+Found";
          }}
          alt={selectedImage?.filename || "Full View"}
          className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-lg z-40"
        />
      </div>
    </ModalPortal>
  );
};

export default SelectedImage;
