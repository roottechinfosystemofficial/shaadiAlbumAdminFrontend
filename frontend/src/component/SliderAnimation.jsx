import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import img1 from "../assets/Standy/1.jpg";
import img2 from "../assets/Standy/2.jpg";
import img3 from "../assets/Standy/3.jpg";
import img4 from "../assets/Standy/4.jpg";
import img5 from "../assets/Standy/5.jpg";
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

const qrLink = "https://shaadialbumadminfrontend.onrender.com"; // <-- Apna link yaha daale

const SliderAnimation = () => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const [qrUrl, setQrUrl] = useState("");

  useEffect(() => {
    const generatedQr = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
      qrLink
    )}&size=150x150`;
    setQrUrl(generatedQr);
  }, []);

  const prevSlide = () => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
  };

  const nextSlide = () => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % images.length);
  };

  const handleDownload = async () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = images[current];

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const qrImg = new Image();
      qrImg.crossOrigin = "anonymous";
      qrImg.src = qrUrl;

      qrImg.onload = () => {
        const padding = 30;
        const qrSize = 150;
        ctx.drawImage(
          qrImg,
          canvas.width - qrSize - padding,
          canvas.height - qrSize - padding,
          qrSize,
          qrSize
        );

        const link = document.createElement("a");
        link.download = `standy-with-qr-${current + 1}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
      };
    };
  };

  return (
    <div className="flex flex-col items-center min-h-screen">
      {/* Top Bar */}
      <div className="w-full flex items-center justify-between px-6 py-4 bg-white shadow-md mb-6">
        <button
          className="flex items-center gap-2 px-3 py-2 bg-slate hover:bg-slate-dark"
          onClick={() => window.history.back()}
        >
          <ArrowLeft size={20} />
          Back
        </button>
        <h1 className="text-xl font-semibold text-gray-800">
          Standy Slider Preview
        </h1>
        <button
          className="text-white bg-primary hover:bg-primary-dark px-4 py-2 rounded transition"
          onClick={handleDownload}
        >
          Download with QR
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
          className="absolute left-2 top-1/3 -translate-y-1/2 w-12 h-12 rounded-full bg-white/80 hover:bg-white shadow-lg flex items-center justify-center text-3xl text-black z-50 transition"
        >
          &#10094;
        </button>

        {/* Image with QR */}
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
              <motion.div
                key={i}
                layout
                layoutId={`img-${i}`}
                transition={{
                  layout: {
                    duration: 0.6,
                    ease: [0.25, 0.1, 0.25, 0.5],
                  },
                }}
                className="absolute rounded-xl shadow-2xl border border-slate bg-white overflow-hidden"
                style={{
                  width: `${width}px`,
                  height: `${height}px`,
                  top: `${top}px`,
                  left,
                  zIndex: 10 - depth * 2,
                  opacity,
                }}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
                {depth === 0 && qrUrl && (
                  <img
                    src={qrUrl}
                    alt="QR Code"
                    className="absolute bg-white p-1 rounded shadow-md"
                    style={{
                      width: "120px",
                      height: "120px",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                    }}
                  />
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Right Arrow */}
        <button
          onClick={nextSlide}
          className="absolute right-2 top-1/3 -translate-y-1/2 w-12 h-12 rounded-full bg-white/80 hover:bg-white shadow-lg flex items-center justify-center text-3xl text-black z-50 transition"
        >
          &#10095;
        </button>
      </div>
    </div>
  );
};

export default SliderAnimation;
