import { Trash2 } from "lucide-react";
import React from "react";
import { FaClosedCaptioning } from "react-icons/fa";
import { MdClose } from "react-icons/md";

const ConfirmDeleteModal = ({ title='Event', isOpen, onCancel, onConfirm, eventName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 text-center">
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          Delete {title}
        </h2>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete {title}
          <span className="font-semibold text-red-500"> {eventName} </span>?
          This action cannot be undone.
        </p>

        <div className="flex justify-center gap-4">
        <button onClick={onCancel} className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-black font-medium text-sm py-2.5 px-5 rounded-lg transition shadow">
          <MdClose size={16} />
          Cancel
        </button>
          <button onClick={onConfirm} className="flex items-center justify-center gap-2 bg-rose-500 hover:bg-rose-600 text-white font-medium text-sm py-2.5 px-5 rounded-lg transition shadow">
          <Trash2 size={16} />
          Delete
        </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
