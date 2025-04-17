import React from "react";

const UnderClientView = ({ setWhichView }) => {
  return (
    <div className="p-8">
      <h2 className="text-3xl font-semibold text-gray-800 mb-8">Welcome</h2>

      {/* Grid layout for the three boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
        {/* Photos Box */}
        <div
          className="bg-white border border-gray-300 rounded-lg  shadow-md hover:shadow-lg transition duration-300 cursor-pointer"
          onClick={() => setWhichView("photos")}
        >
          <img
            src="https://images.pexels.com/photos/1085077/pexels-photo-1085077.jpeg"
            alt="Photos"
            className="w-full h-40 object-cover rounded-md mb-4"
          />
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">
            Photos
          </h3>
          <p className="text-gray-600 text-sm sm:text-base">
            Upload and view your photos.
          </p>
        </div>

        {/* Flipbook Box */}
        <div
          className="bg-white border border-gray-300 rounded-lg  shadow-md hover:shadow-lg transition duration-300 cursor-pointer"
          onClick={() => setWhichView("flipbook")}
        >
          <img
            src="https://cdn0.weddingwire.in/article/7121/3_2/960/jpg/91217-indian-wedding-album-design-mili-ghosh-lead.jpeg"
            alt="Flipbook"
            className="w-full h-40 object-cover rounded-md mb-4"
          />
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">
            Flipbook
          </h3>
          <p className="text-gray-600 text-sm sm:text-base">
            Create and explore flipbooks of your content.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UnderClientView;
