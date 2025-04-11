import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import img1 from "../assets/Standy/1.jpg";
import img2 from "../assets/Standy/2.jpg";
import img3 from "../assets/Standy/3.jpg";
import img4 from "../assets/Standy/4.jpg";
import img5 from "../assets/Standy/5.jpg";``
import img6 from "../assets/Standy/6.jpg";
import img7 from "../assets/Standy/7.jpg";
import img8 from "../assets/Standy/8.jpg";
import img9 from "../assets/Standy/9.jpg";
import img10 from "../assets/Standy/10.jpg";
import img11 from "../assets/Standy/11.jpg";
import tableImg from "../assets/Standy/qr_back.png";

const images = [
  img1,
  img2,
  img3,
  img4,
  img5,
  img6,
  img7,
  img8,
  img9,
  img10,
  img11,
];

const SliderAnimation = () => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  const prevSlide = () => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
  };

  const nextSlide = () => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % images.length);
  };

  return (
    <div className="flex flex-col items-center min-h-screen">
      {/* Top Bar */}
      <div className="w-full flex items-center justify-between px-6 py-4 bg-white shadow-md mb-6">
        <button
          className="flex items-center gap-2 text-slate-dark hover:text-black transition"
          onClick={() => window.history.back()}
        >
          <ChevronLeft size={20} />
          Back
        </button>
        <h1 className="text-xl font-semibold text-gray-800">
          Standy Slider Preview
        </h1>
        <button
          className="text-white bg-primary hover:bg-primary-dark px-4 py-2 rounded transition"
          onClick={() => {
            const link = document.createElement("a");
            link.href = images[current];
            link.download = `standy-${current + 1}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }}
        >
          Download
        </button>
      </div>

      {/* Slider Section */}
      <div
        className="relative flex items-center justify-center max-w-[1800px] h-[750px] px-4 bg-no-repeat bg-center bg-contain"
        style={{ backgroundImage: `url(${tableImg})` }}
      >
        {/* Left Arrow */}
        <button
          onClick={prevSlide}
          className="absolute left-2 top-1/3 -translate-y-1/2 w-12 h-12 rounded-full bg-white/80 hover:bg-white shadow-lg flex items-center justify-center text-3xl text-slate-dark hover:text-black z-50 transition"
        >
          &#10094;
        </button>

        {/* Image Slider */}
        <div className="relative w-[1200px] h-[600px] flex mt-9 justify-center overflow-hidden">
          {images.map((img, i) => {
            const offset = (i - current + images.length) % images.length;
            const visibleOffset =
              offset === 0
                ? 0
                : offset <= images.length / 2
                ? offset
                : offset - images.length;

            const depth = Math.abs(visibleOffset);
            if (depth > 2) return null;

            const baseWidth = 320;
            const baseHeight = 400;
            const scaleFactor = 0.65;
            const scale = Math.pow(scaleFactor, depth);

            const width = baseWidth * scale;
            const height = baseHeight * scale;

            const leftOffset = 260;
            const top = depth * 30;
            const left = `calc(50% + ${visibleOffset * leftOffset}px - ${
              width / 2
            }px)`;

            const opacity = depth === 2 ? 0.2 : 1;

            return (
              <motion.img
                key={i}
                src={img}
                layout
                layoutId={`img-${i}`}
                transition={{
                  layout: {
                    duration: 0.6,
                    ease: [0.25, 0.1, 0.25, 0.5],
                  },
                }}
                className="absolute object-cover rounded-xl shadow-2xl border border-slate bg-white"
                style={{
                  width: `${width}px`,
                  height: `${height}px`,
                  top: `${top}px`,
                  left,
                  zIndex: 10 - depth * 2,
                  opacity,
                }}
              />
            );
          })}
        </div>

        {/* Right Arrow */}
        <button
          onClick={nextSlide}
          className="absolute right-2 top-1/3 -translate-y-1/2 w-12 h-12 rounded-full bg-white/80 hover:bg-white shadow-lg flex items-center justify-center text-3xl text-slate-dark hover:text-black z-50 transition"
        >
          &#10095;
        </button>
      </div>
    </div>
  );
};

export default SliderAnimation;
