import React from "react";
import { MdClose } from "react-icons/md";
import { FaCamera, FaCheck } from "react-icons/fa";

const FaceRecognitionModal = ({
  isOpen,
  onCancel,
  onCapture,
  onSubmit,
  webcamRef,
  capturedImage,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 text-center">
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          Face Recognition
        </h2>
        <p className="text-gray-600 mb-4">
          Please align your face in the camera to capture.
        </p>

        <div className="w-full h-64 rounded-lg overflow-hidden bg-gray-100 mb-6 flex items-center justify-center">
          {capturedImage ? (
            <img
              src={capturedImage}
              alt="Captured"
              className="w-full h-full object-cover"
            />
          ) : (
            <video
              ref={webcamRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
          )}
        </div>

        <div className="flex justify-center gap-4">
          {/* Close */}
          <button
            onClick={onCancel}
            className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-black font-medium text-sm py-2.5 px-5 rounded-lg transition shadow"
          >
            <MdClose size={16} />
            Close
          </button>

          {/* Capture */}
          <button
            onClick={onCapture}
            className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-medium text-sm py-2.5 px-5 rounded-lg transition shadow"
          >
            <FaCamera size={16} />
            {capturedImage ? "Retake" : "Capture"}
          </button>

          {/* Submit */}
          <button
            onClick={onSubmit}
            disabled={!capturedImage}
            className={`flex items-center justify-center gap-2 ${
              capturedImage
                ? "bg-green-500 hover:bg-green-600"
                : "bg-gray-300 cursor-not-allowed"
            } text-white font-medium text-sm py-2.5 px-5 rounded-lg transition shadow`}
          >
            <FaCheck size={16} />
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default FaceRecognitionModal;
