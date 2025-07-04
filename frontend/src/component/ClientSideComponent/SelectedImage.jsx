import React, { useEffect } from "react";
import { X, Download } from "lucide-react";
import ModalPortal from "./ModalPortal";
import { useSelector } from "react-redux";

const SelectedImage = ({ selectedImage, setSelectedImage,currentView="All" }) => {
  const settingState = useSelector((state) => state.settings.settingState);

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

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed:", err);
      alert("Failed to download image. CORS or network error.");
    }
  };

  const getWatermarkStyle = () => {
    const positionMap = {
      "top-left": { top: "5%", left: "5%" },
      "top-center": { top: "5%", left: "50%", transform: "translateX(-50%)" },
      "top-right": { top: "5%", right: "5%" },
      "center-left": { top: "50%", left: "5%", transform: "translateY(-50%)" },
      center: { top: "50%", left: "50%", transform: "translate(-50%, -50%)" },
      "center-right": { top: "50%", right: "5%", transform: "translateY(-50%)" },
      "bottom-left": { bottom: "5%", left: "5%" },
      "bottom-center": { bottom: "5%", left: "50%", transform: "translateX(-50%)" },
      "bottom-right": { bottom: "5%", right: "5%" },
    };

    const positionStyles = positionMap[settingState.position] || {};
    return {
      position: "absolute",
      opacity: settingState.opacity / 100,
      pointerEvents: "none",
      zIndex: 40,
      ...positionStyles,
    };
  };

  return (
    <ModalPortal>
      <div
        id="modal-bg"
        onClick={handleClickOutside}
        className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center"
      >
        <div className="absolute top-4 right-4 flex gap-x-2 z-50">
          <button
            onClick={handleDownload}
            className="bg-white p-2 rounded-full shadow hover:bg-gray-100"
            aria-label="Download Image"
          >
            <Download className="w-5 h-5 text-black" />
          </button>
          <button
            onClick={() => setSelectedImage(null)}
            className="bg-white p-2 rounded-full shadow hover:bg-gray-100"
            aria-label="Close Modal"
          >
            <X className="w-5 h-5 text-black" />
          </button>
        </div>

        <div className="relative max-w-full max-h-[85vh]">
          <img
            src={currentView!="All" ? selectedImage?.url : selectedImage.originalUrl}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://via.placeholder.com/800x600?text=Image+Not+Found";
            }}
            alt={selectedImage?.filename || "Full View"}
            className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-lg z-30"
          />

          {/* ✅ Watermark */}
          {settingState?.waterMarkEnabled && (
            <>
              {settingState.watermarkType === "text" &&
                settingState.watermarkText && (
                  <div
                    style={{
                      ...getWatermarkStyle(),
                      fontSize: `${settingState.fontSize}px`,
                      color: settingState.fontColor,
                      fontFamily: settingState.fontStyle,
                    }}
                  >
                    {settingState.watermarkText}
                  </div>
                )}

              {settingState.watermarkType === "icon" && settingState.iconImg && (
                <img
                  src={settingState.iconImg}
                  alt="Watermark Icon"
                  style={{
                    ...getWatermarkStyle(),
                    width: `${settingState.iconSize}px`,
                    height: `${settingState.iconSize}px`,
                  }}
                />
              )}
            </>
          )}
        </div>
      </div>
    </ModalPortal>
  );
};

export default SelectedImage;
