import React, { useState, useEffect, useRef, memo } from "react";

const totalImages = 50;
const batchSize = 6;

const getImageUrls = (start, count) => {
  return Array.from({ length: count }, (_, i) => {
    const imageIndex = start + i + 1;
    const imageName = `img (${imageIndex})`;
    return `https://res.cloudinary.com/dzfaikj95/image/upload/w_300,c_scale/shaadialum/${imageName}.jpg`;
  });
};

const PhotosPanel = () => {
  const [visibleImages, setVisibleImages] = useState([]);
  const [loadedAll, setLoadedAll] = useState(false);
  const loaderRef = useRef(null);

  useEffect(() => {
    setVisibleImages(getImageUrls(0, batchSize));
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadedAll) {
          requestIdleCallback(() => loadMoreImages());
        }
      },
      { rootMargin: "150px" }
    );

    if (loaderRef.current) observer.observe(loaderRef.current);

    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [visibleImages, loadedAll]);

  const loadMoreImages = () => {
    const current = visibleImages.length;
    if (current >= totalImages) {
      setLoadedAll(true);
      return;
    }

    const nextBatch = getImageUrls(
      current,
      Math.min(batchSize, totalImages - current)
    );
    setVisibleImages((prev) => [...prev, ...nextBatch]);
  };

  return (
    <div className="p-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {visibleImages.map((photo, index) => (
          <MemoizedImageCard key={index} src={photo} />
        ))}
      </div>
      {!loadedAll && (
        <div ref={loaderRef} className="text-center mt-4 text-gray-500">
          Loading more images...
        </div>
      )}
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
        className={`w-[300px] object-cover h-48 transition duration-300 ease-in-out ${
          loaded ? "opacity-100 scale-100" : "opacity-0"
        } group-hover:scale-105`}
      />
      {!loaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg" />
      )}
    </div>
  );
};

const MemoizedImageCard = memo(ImageCard);

export default PhotosPanel;
