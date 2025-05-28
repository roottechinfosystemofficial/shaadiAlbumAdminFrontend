import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import img0 from "../assets/Standy/1.jpg";
import img1 from "../assets/Standy/2.jpg";
import img2 from "../assets/Standy/3.jpg";
import img3 from "../assets/Standy/4.jpg";
import img4 from "../assets/Standy/5.jpg";
import img5 from "../assets/Standy/6.jpg";
import img6 from "../assets/Standy/7.jpg";
import img7 from "../assets/Standy/8.jpg";
import img8 from "../assets/Standy/9.jpg";
import img9 from "../assets/Standy/10.jpg";
import img10 from "../assets/Standy/11.jpg";

// Images with fake QR (for the slider display)
import img11 from "../assets/Standy_qr/1.jpg";
import img12 from "../assets/Standy_qr/2.jpg";
import img13 from "../assets/Standy_qr/3.jpg";
import img14 from "../assets/Standy_qr/4.jpg";
import img15 from "../assets/Standy_qr/5.jpg";
import img16 from "../assets/Standy_qr/6.jpg";
import img17 from "../assets/Standy_qr/7.jpg";
import img18 from "../assets/Standy_qr/8.jpg";
import img19 from "../assets/Standy_qr/9.jpg";
import img20 from "../assets/Standy_qr/10.jpg";
import img21 from "../assets/Standy_qr/11.jpg";
import tableImg from "../assets/Standy/qr_back.png";
import { useSelector } from "react-redux";
import QRCode from "qrcode";
import toast from "../utils/toast.js";

// Images with fake QR (shown in the slider)
const imagesWithFakeQR = [
  img11,
  img12,
  img13,
  img14,
  img15,
  img16,
  img17,
  img18,
  img19,
  img20,
  img21,
];

const imagesWithoutQR = [
  img0,
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
];

// QR settings for each image
const qrSettings = {
  0: { top: "52%", left: "50%", size: "33%" },
  1: { top: "52%", left: "50%", size: "30%" },
  2: { top: "50%", left: "70%", size: "38%" },
  3: { top: "51%", left: "50%", size: "29%" },
  4: { top: "52%", left: "50%", size: "33%" },
  5: { top: "60%", left: "50%", size: "29%" },
  6: { top: "63%", left: "50%", size: "33%" },
  7: { top: "48%", left: "50%", size: "33%" },
  8: { top: "48%", left: "50%", size: "40%" },
  9: { top: "71%", left: "50%", size: "30%" },
  10: { top: "54%", left: "50%", size: "30%" },
};
const textSettings = {
  0: {
    top: "28%",
    left: "50%",
    fontSize: "100px",
  },
  1: { top: "28%", left: "50%", fontSize: "100px" },
  2: { top: "28%", left: "70%", fontSize: "100px" },
  3: { top: "32%", left: "50%", fontSize: "100px" },
  4: { top: "32%", left: "48%", fontSize: "120px" },
  5: { top: "43%", left: "50%", fontSize: "100px" },
  6: { top: "43%", left: "50%", fontSize: "100px" },
  7: { top: "27%", left: "50%", fontSize: "110px" },
  8: { top: "24%", left: "50%", fontSize: "110px" },
  9: { top: "32%", left: "50%", fontSize: "140px" },
  10: { top: "35%", left: "50%", fontSize: "130px" },
};

const SliderAnimation = () => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const [loading, setLoading] = useState(false); // State for loading

  const { currentEvent } = useSelector((state) => state.event);
  console.log(currentEvent);

  useEffect(() => {
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
    setCurrent(
      (prev) => (prev - 1 + imagesWithFakeQR.length) % imagesWithFakeQR.length
    );
  };

  const nextSlide = () => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % imagesWithFakeQR.length);
  };

  const handleDownload = async () => {
    setLoading(true); // Set loading to true
    try {
      const currentImage = imagesWithoutQR[current]; // Get the real image (without fake QR)
      // const qrData = "https://www.google.co.in"; // Always generate this QR
      const qrData = `http://localhost:5173/${currentEvent._id}/clientview`;
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = currentImage;

      img.onload = async () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = img.width;
        canvas.height = img.height;

        // Step 1: Draw the original image (without the fake QR)
        ctx.drawImage(img, 0, 0);

        // Step 2: Generate the new QR code
        const qrCodeDataUrl = await QRCode.toDataURL(qrData, {
          width: 250, // This is still fixed but we'll scale based on percentage
          margin: 0, // No margin so it looks tight
        });

        const qrImg = new Image();
        qrImg.src = qrCodeDataUrl;

        qrImg.onload = () => {
          // Step 3: Get QR position and size based on the image
          const { top, left, size } = qrSettings[current]; // Using settings for this image
          const qrWidth = (parseInt(size) / 100) * canvas.width; // Size as percentage of image width
          const qrHeight = qrWidth; // Keep it square

          // Calculate the top and left offsets as percentages of the image size
          const qrTop = (parseInt(top) / 100) * canvas.height - qrHeight / 2;
          const qrLeft = (parseInt(left) / 100) * canvas.width - qrWidth / 2;

          // Step 4: Draw the QR code over the image
          ctx.drawImage(qrImg, qrLeft, qrTop, qrWidth, qrHeight);

          // Step 5: Draw the event name text
          const eventName = currentEvent?.eventName || "Event Name";
          console.log(eventName);

          const {
            top: textTop,
            left: textLeft,
            fontSize,
          } = textSettings[current]; // Get text settings for this image
          const fontSizePx = parseInt(fontSize); // Convert font size to pixels
          ctx.font = `bold ${fontSizePx}px Arial`; // Make the text bold
          ctx.fillStyle = "black"; // Text color set to black
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";

          const textTopOffset = (parseInt(textTop) / 100) * canvas.height;
          const textLeftOffset = (parseInt(textLeft) / 100) * canvas.width;

          // Draw the text on the canvas
          ctx.fillText(eventName, textLeftOffset, textTopOffset);

          // Step 6: Download the final image
          const link = document.createElement("a");
          link.download = "standy_with_qr_and_text.jpg";
          link.href = canvas.toDataURL("image/jpeg", 0.95);
          link.click();

          setLoading(false); // Set loading to false after download
          toast.success("Download started successfully!");
        };
      };
    } catch (error) {
      console.error("Download failed", error);
      setLoading(false); // Set loading to false on error
      toast.error("Download failed. Please try again.");
    }
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
          disabled={loading} // Disable button while loading
        >
          {loading ? "Downloading..." : "Download with QR"}
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
          {imagesWithFakeQR.map((img, i) => {
            const offset =
              (i - current + imagesWithFakeQR.length) % imagesWithFakeQR.length;
            const visibleOffset =
              offset === 0
                ? 0
                : offset <= imagesWithFakeQR.length / 2
                ? offset
                : offset - imagesWithFakeQR.length;
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
