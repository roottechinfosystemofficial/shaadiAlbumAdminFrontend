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
      const canvasRight = document.createElement("canvas");

      canvasLeft.width = canvasRight.width = width / 2;
      canvasLeft.height = canvasRight.height = height;

      const ctxLeft = canvasLeft.getContext("2d");
      ctxLeft.drawImage(img, 0, 0, width / 2, height, 0, 0, width / 2, height);

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
  const bookRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const preparePages = async () => {
      if (!images || images.length === 0) return;
      setLoading(true);

      try {
        const processed = [images[frontCover]];
        const middleImages = images.filter(
          (_, i) => i !== frontCover && i !== backCover
        );

        const splitResults = await Promise.allSettled(
          middleImages.map((src) => splitImage(src))
        );

        const splitPages = splitResults
          .filter((r) => r.status === "fulfilled")
          .flatMap((r) => r.value);

        processed.push(...splitPages, images[backCover]);
        setPages(processed);
      } catch (err) {
        console.error("Image processing failed", err);
      } finally {
        setLoading(false);
      }
    };

    preparePages();
  }, [images, frontCover, backCover]);

  const nextPage = () => {
    if (bookRef.current) {
      bookRef.current.pageFlip().flipNext();
    }
  };

  const prevPage = () => {
    if (bookRef.current) {
      bookRef.current.pageFlip().flipPrev();
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white space-y-6">
        <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin" />
        <p className="text-2xl font-semibold animate-pulse">
          Loading Flipbook...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-black relative">
      <HTMLFlipBook
        width={isMobile ? window.innerWidth : 600}
        height={isMobile ? window.innerHeight : 400}
        size={isMobile ? "stretch" : "fixed"}
        minWidth={isMobile ? 300 : 600}
        maxWidth={isMobile ? window.innerWidth : 600}
        minHeight={isMobile ? 200 : 400}
        maxHeight={isMobile ? window.innerHeight : 400}
        showCover={true}
        usePortrait={false}
        mobileScrollSupport={isMobile}
        ref={bookRef}
        onFlip={(e) => setCurrentPage(e.data)}
        className="shadow-lg"
      >
        {pages.map((src, index) => (
          <div
            key={index}
            className={`w-full h-full ${
              index === 0 || index === pages.length - 1
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

      <div className="flex items-center justify-between w-full max-w-[800px] mt-6 px-4 z-10">
        <button
          onClick={prevPage}
          className="p-3 rounded-full bg-white text-black hover:bg-gray-300 transition-transform transform hover:scale-110"
        >
          <ArrowLeft />
        </button>
        <span className="text-white text-lg font-semibold">
          Page {currentPage + 1} / {pages.length}
        </span>
        <button
          onClick={nextPage}
          className="p-3 rounded-full bg-white text-black hover:bg-gray-300 transition-transform transform hover:scale-110"
        >
          <ArrowRight />
        </button>
      </div>
    </div>
  );
};

export default Flipbookfun;
