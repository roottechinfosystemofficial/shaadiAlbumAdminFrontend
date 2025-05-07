import React, { useRef, useState, useEffect } from "react";
import HTMLFlipBook from "react-pageflip";
import { ArrowLeft, ArrowRight } from "lucide-react";

// Function to split an image into left and right halves
const splitImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const width = img.width;
      const height = img.height;

      const canvasLeft = document.createElement("canvas");
      canvasLeft.width = width / 2;
      canvasLeft.height = height;
      const ctxLeft = canvasLeft.getContext("2d");
      ctxLeft.drawImage(img, 0, 0, width / 2, height, 0, 0, width / 2, height);

      const canvasRight = document.createElement("canvas");
      canvasRight.width = width / 2;
      canvasRight.height = height;
      const ctxRight = canvasRight.getContext("2d");
      ctxRight.drawImage(
        img,
        width / 2,
        0,
        width / 2,
        height,
        0,
        0,
        width / 2,
        height
      );

      resolve([canvasLeft.toDataURL(), canvasRight.toDataURL()]);
    };
    img.onerror = reject;
    img.src = src;
  });
};

const Flipbookfun = ({ images, frontCover, backCover }) => {
  // console.log({ images, frontCover, backCover });

  const bookRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const preparePages = async () => {
      if (!images || images.length === 0) return;

      setLoading(true);

      const processed = [images[frontCover]]; // Use passed front cover
      const middleImages = images.filter(
        (_, i) => i !== frontCover && i !== backCover
      );

      const splitImagesBatch = async (imgSources) => {
        const promises = imgSources.map((src) => splitImage(src));
        const results = await Promise.allSettled(promises);
        return results
          .filter((res) => res.status === "fulfilled")
          .flatMap((res) => res.value);
      };

      try {
        const splitPages = await splitImagesBatch(middleImages);
        processed.push(...splitPages, images[backCover]); // Use passed back cover
        setPages(processed);
      } catch (err) {
        console.error("Error processing images:", err);
      } finally {
        setLoading(false);
      }
    };

    preparePages();
  }, [images, frontCover, backCover]);

  const nextPage = () => {
    if (currentPage < pages.length - 1) {
      bookRef.current.pageFlip().flipNext();
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      bookRef.current.pageFlip().flipPrev();
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white space-y-6">
        <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin" />
        <p className="text-2xl font-semibold animate-pulse tracking-wide">
          Loading your flipbook...
        </p>
        <p className="text-sm text-gray-400">This may take a few seconds ⏳</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-y-10 items-center justify-center w-full min-h-screen bg-black relative overflow-hidden">
      {/* 📱 Mobile Version */}
      <div className="sm:hidden absolute top-0 left-0 w-full h-full flex items-center justify-center">
        <div
          className="absolute top-0 left-0"
          style={{
            width: "100%",
            height: "100%",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "black",
            touchAction: "none",
          }}
        >
          <HTMLFlipBook
            width={window.innerHeight}
            height={window.innerWidth}
            size="stretch"
            showCover={true}
            usePortrait={false}
            mobileScrollSupport={true}
            ref={bookRef}
            onFlip={(e) => setCurrentPage(e.data)}
            className="shadow-md"
          >
            {pages.map((src, index) => (
              <div key={index} className="w-full h-full">
                <img
                  src={src}
                  alt={`Page ${index + 1}`}
                  className="w-full h-full object-contain"
                />
              </div>
            ))}
          </HTMLFlipBook>
        </div>
      </div>

      {/* 💻 Desktop Version */}
      <div className="hidden sm:flex justify-center items-center">
        <HTMLFlipBook
          width={400}
          height={366}
          size="fixed"
          minWidth={400}
          maxWidth={600}
          minHeight={366}
          maxHeight={400}
          showCover={true}
          usePortrait={false}
          mobileScrollSupport={false}
          onFlip={(e) => setCurrentPage(e.data)}
          ref={bookRef}
          className="shadow-xl"
        >
          {pages.map((src, index) => (
            <div
              key={index}
              className={`w-full h-full ${
                index === frontCover || index === backCover
                  ? "border-4 border-yellow-500"
                  : ""
              }`}
            >
              <img
                src={src}
                alt={`Page ${index + 1}`}
                className="w-full h-full object-contain"
              />
            </div>
          ))}
        </HTMLFlipBook>
      </div>

      <div className="flex items-center justify-between w-full max-w-[800px] mt-4 px-4">
        <button
          onClick={prevPage}
          className="p-3 rounded-full bg-white text-gray-900 hover:bg-gray-300 transition-transform transform hover:scale-110"
        >
          <ArrowLeft />
        </button>
        <span className="text-white font-semibold text-lg tracking-wide">
          Page {currentPage + 1} / {pages.length}
        </span>
        <button
          onClick={nextPage}
          className="p-3 rounded-full bg-white text-gray-900 hover:bg-gray-300 transition-transform transform hover:scale-110"
        >
          <ArrowRight />
        </button>
      </div>
    </div>
  );
};

export default Flipbookfun;
