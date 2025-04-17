import React, { useState } from "react";

const totalImages = 50;

const photoArray = Array.from({ length: totalImages }, (_, i) => {
  return `/PHOTOS/img (${i + 1}).jpg`;
});

const PhotosPanel = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4">
      {photoArray.map((photo, index) => (
        <ImageCard key={index} src={photo} alt={`Photo ${index + 1}`} />
      ))}
    </div>
  );
};

const ImageCard = ({ src, alt }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="overflow-hidden rounded-lg shadow-md relative group">
      <img
        loading="lazy"
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        className={`w-full h-48 object-cover transform transition duration-300 ease-in-out ${
          loaded ? "opacity-100 scale-100" : "opacity-0 scale-105 blur-sm"
        } group-hover:scale-105`}
      />
      {!loaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg"></div>
      )}
    </div>
  );
};

export default PhotosPanel;
