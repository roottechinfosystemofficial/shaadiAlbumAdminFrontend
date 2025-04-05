const SettingsPanel = ({ activeItem, onItemClick }) => {
  const settingsItems = [
    "Event Setting",
    "Front Design",
    "Cover Image",
    "FaceScan Pre Registration",
    "All Folder Pre Registration",
  ];

  return (
    <div className="mt-2 text-sm px-2">
      <p className="font-semibold text-gray-800 mb-2">Settings</p>
      <ul className="space-y-1">
        {settingsItems.map((label) => (
          <li
            key={label}
            onClick={() => onItemClick(label)}
            className={`cursor-pointer px-3 py-2 rounded-md transition ${
              activeItem === label
                ? "border-l-2 border-blue-500 bg-blue-50 font-medium"
                : "hover:bg-gray-100"
            }`}
          >
            {label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SettingsPanel;
