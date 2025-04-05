const ActivitiesPanel = ({ activeItem, onItemClick }) => {
  const activityItems = [
    "Download Activity",
    "Favorite Activities",
    "User Uploaded Media",
    "Facial Recognition",
  ];

  return (
    <div className="mt-2 text-sm px-2 ">
      <p className="font-semibold text-gray-800 mb-2">Activities</p>
      <ul className="space-y-1">
        {activityItems.map((label) => (
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

export default ActivitiesPanel;
