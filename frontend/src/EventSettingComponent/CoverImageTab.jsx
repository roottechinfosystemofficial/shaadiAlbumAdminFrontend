import React, { useState } from "react";

const CoverImageUploader = ({ title, imageUrl, onUpload }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative w-full max-w-md border border-gray-300 rounded-lg overflow-hidden"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img src={imageUrl} alt="cover" className="w-full h-48 object-cover" />

      {hovered && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-white space-y-2">
          <button className="bg-white text-black px-3 py-1 rounded">
            View Mine
          </button>
          <button className="bg-white text-black px-3 py-1 rounded">
            View All
          </button>
          <label className="cursor-pointer bg-blue-500 px-4 py-1 rounded">
            Upload
            <input type="file" className="hidden" onChange={onUpload} />
          </label>
        </div>
      )}
    </div>
  );
};

export function CoverImageTab() {
  const [split, setSplit] = useState(false);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    console.log("Uploading:", file);
  };

  return (
    <div className="p-4 space-y-4">
      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={split}
          onChange={() => setSplit(!split)}
        />
        <span>Split</span>
      </label>

      {split ? (
        <div className="flex gap-6">
          {/* Left Side - Image */}
          <div className="w-1/2">
            <CoverImageUploader
              title="Cover Image"
              imageUrl="/images/sample.jpg"
              onUpload={handleUpload}
            />
          </div>

          {/* Middle Side - Options */}
          <div className="w-1/2 space-y-4">
            <label className="block">
              Label:
              <input
                type="text"
                className="block w-full mt-1 border px-2 py-1 rounded"
                placeholder="Enter label"
              />
            </label>

            <label className="block">
              Border:
              <select className="block w-full mt-1 border px-2 py-1 rounded">
                <option>None</option>
                <option>Thin</option>
                <option>Thick</option>
              </select>
            </label>

            <label className="block">
              Corner Style:
              <select className="block w-full mt-1 border px-2 py-1 rounded">
                <option>Sharp</option>
                <option>Rounded</option>
              </select>
            </label>
          </div>
        </div>
      ) : (
        // Normal layout
        <CoverImageUploader
          title="Cover Image"
          imageUrl="/images/sample.jpg"
          onUpload={handleUpload}
        />
      )}
    </div>
  );
}
