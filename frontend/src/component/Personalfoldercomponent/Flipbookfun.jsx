import React, { useRef, useState, useEffect } from "react";
import HTMLFlipBook from "react-pageflip";
import { ArrowLeft, ArrowRight } from "lucide-react";

// Function to split an image into left and right halves
const splitImage = (src) => {
  return new Promise((resolve) => {
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
    img.src = src;
  });
};

const Flipbookfun = ({ images }) => {
  const bookRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pages, setPages] = useState([]);

  useEffect(() => {
    const preparePages = async () => {
      if (!images || images.length === 0) return;

      const processed = [];

      // Front cover (first image)
      processed.push(images[0]);

      // Split all remaining images except the cover
      for (let i = 1; i < images.length; i++) {
        if (i === images.length - 1) {
          // Last page - no split, add it as a full page (back cover)
          processed.push(images[i]);
        } else {
          // Split the image into left and right halves
          const [left, right] = await splitImage(images[i]);
          processed.push(left, right);
        }
      }

      setPages(processed);
    };

    preparePages();
  }, [images]);

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

  return (
    <div className="flex flex-col items-center justify-center w-[95%] mx-auto min-h-screen bg-black overflow-hidden">
      <div className="w-[90%] md:w-[70%] lg:w-[60%] flex justify-center items-center">
        <HTMLFlipBook
          width={600}
          height={500}
          size="fixed"
          minWidth={400}
          maxWidth={400}
          minHeight={500}
          maxHeight={500}
          showCover={true}
          maxShadowOpacity={0.6}
          mobileScrollSupport={false}
          usePortrait={false}
          onFlip={(e) => setCurrentPage(e.data)}
          ref={bookRef}
          className="shadow-xl"
        >
          {pages.map((src, index) => (
            <div
              key={index}
              className={`w-full h-full ${
                index === 0 ? "bg-cover bg-center" : ""
              }`}
            >
              <img
                src={src}
                alt={`Page ${index + 1}`}
                className="w-full h-full object-contain mx-auto"
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
