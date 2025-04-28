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
import { useSelector } from "react-redux";
import QRCode from "qrcode";
// Fake QR for display purposes
import fakeQrImage from "/Fakeqrbg.png"; // Add a transparent fake QR code image

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

// QR Settings (for each image)
const qrSettings = {
  0: { top: "50%", left: "50%", size: 100 },
  1: { top: "52%", left: "50%", size: 100 },
  2: { top: "50%", left: "70%", size: 100 },
  3: { top: "51%", left: "50%", size: 90 },
  4: { top: "50%", left: "50%", size: 100 },
  5: { top: "60%", left: "50%", size: 100 },
  6: { top: "63%", left: "50%", size: 100 },
  7: { top: "48%", left: "50%", size: 100 },
  8: { top: "48%", left: "50%", size: 120 },
  9: { top: "73%", left: "50%", size: 100 },
  10: { top: "47%", left: "50%", size: 130 },
};

const qrLink = "https://shaadialbumadminfrontend.onrender.com";
const SliderAnimation = () => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const [qrUrl, setQrUrl] = useState("");
  const { singleEvent } = useSelector((state) => state.event);

  // Generate QR code URL
  useEffect(() => {
    const generatedQr = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
      qrLink
    )}&size=150x150`;
    console.log(generatedQr);

    setQrUrl(generatedQr);

    const handleKeyDown = (e) => {
      e.preventDefault();
      if (e.key === "ArrowRight") {
        nextSlide();
      } else if (e.key === "ArrowLeft") {
        prevSlide();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
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
    alert("Download");
  };

  return (
    <div className="flex flex-col items-center min-h-screen">
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

      <div
        className="relative flex items-center justify-center max-w-[1800px] h-[750px] px-4 bg-no-repeat bg-center bg-contain"
        style={{ backgroundImage: `url(${tableImg})` }}
      >
        <button
          onClick={prevSlide}
          className="absolute left-2 top-1/3 -translate-y-1/2 w-12 h-12 rounded-full bg-white/80 hover:bg-white shadow-lg flex items-center justify-center text-3xl text-black z-50 transition"
        >
          &#10094;
        </button>

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

            // QR Settings for each image (same QR settings applied to all images)
            const settings = qrSettings[i] || {};
            const qrSize = settings.size || 120;
            const qrTop = settings.top || "50%";
            const qrLeft = settings.left || "50%";

            // Scale the QR code size based on image's size
            const qrScaledSize = qrSize * scale;

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
                className="absolute rounded-xl shadow-2xl border border-slate overflow-hidden"
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
                {/* Fake QR Code on all images */}
                <img
                  src={fakeQrImage}
                  alt="QR Code"
                  className="absolute bg-transparent p-1 rounded"
                  style={{
                    top: qrTop,
                    left: qrLeft,
                    width: qrScaledSize,
                    height: qrScaledSize,
                    transform: "translate(-50%, -50%)",
                  }}
                />
              </motion.div>
            );
          })}
        </div>

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
