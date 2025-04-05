import { EditIcon, Trash2 } from "lucide-react";

const FolderPanel = ({ activeItem, onItemClick }) => {
  const isActive = activeItem === "Highlights";

  return (
    <div className="mt-2">
      <p className="font-medium flex items-center justify-between">
        Folder Lists
        <span className="text-blue-500 cursor-pointer hover:underline">
          + Add Folder
        </span>
      </p>

      <div
        className={`flex items-center justify-between mt-4 px-2 py-3 rounded-md transition cursor-pointer ${
          isActive
            ? "bg-blue-50 border-l-4 border-blue-500"
            : "hover:bg-gray-100"
        }`}
        onClick={() => onItemClick("Highlights")}
        
      >
        <div
          className={`font-medium ${
            isActive ? "text-blue-600" : "text-gray-700"
          }`}
        >
          Highlights - (0)
        </div>

        <div className="flex gap-2">
          <button className="p-1 rounded hover:bg-gray-200">
            <EditIcon size={15} />
          </button>
          <button className="p-1 rounded hover:bg-gray-200">
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FolderPanel;
