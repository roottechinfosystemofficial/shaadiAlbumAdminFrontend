import React, { useState } from "react";
import sampleImg from "../../assets/client/photo-1478760329108-5c3ed9d495a0.jpg";

const WatermarkSetting = () => {
  const [watermarkType, setWatermarkType] = useState("text");
  const [watermarkText, setWatermarkText] = useState("Dhruv");
  const [fontStyle, setFontStyle] = useState("Arial");
  const [fontColor, setFontColor] = useState("white");
  const [fontSize, setFontSize] = useState(75);
  const [opacity, setOpacity] = useState(50);
  const [position, setPosition] = useState("bottom-right");
  const [iconImg, setIconImg] = useState(null);

  const fontColors = ["white", "black", "gray", "red", "blue"];
  const fontStyles = ["Arial", "Times New Roman", "Courier New", "Verdana"];
  const positions = [
    "top-left",
    "top-center",
    "top-right",
    "center-left",
    "center",
    "center-right",
    "bottom-left",
    "bottom-center",
    "bottom-right",
  ];

  const getPositionStyles = () => {
    const styleMap = {
      "top-left": { top: "5%", left: "5%" },
      "top-center": { top: "5%", left: "50%", transform: "translateX(-50%)" },
      "top-right": { top: "5%", right: "5%" },
      "center-left": { top: "50%", left: "5%", transform: "translateY(-50%)" },
      center: { top: "50%", left: "50%", transform: "translate(-50%, -50%)" },
      "center-right": {
        top: "50%",
        right: "5%",
        transform: "translateY(-50%)",
      },
      "bottom-left": { bottom: "5%", left: "5%" },
      "bottom-center": {
        bottom: "5%",
        left: "50%",
        transform: "translateX(-50%)",
      },
      "bottom-right": { bottom: "5%", right: "5%" },
    };
    return styleMap[position] || {};
  };

  const handleIconUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIconImg(URL.createObjectURL(file));
    }
  };

  const renderPositionGrid = () => (
    <div className="grid grid-cols-3 sm:grid-cols-3 gap-2">
      {positions.map((pos) => (
        <button
          key={pos}
          onClick={() => setPosition(pos)}
          className={`py-2 px-2 rounded text-xs text-center border ${
            position === pos
              ? "bg-primary text-white"
              : "bg-white hover:bg-gray-200"
          }`}
        >
          {pos.replace("-", "\n").toUpperCase()}
        </button>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen p-4 sm:p-6 bg-slate text-gray-900">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Preview */}
        <div className="relative w-full aspect-video rounded overflow-hidden shadow border border-slate-dark bg-white">
          <img
            src={sampleImg}
            alt="preview"
            className="w-full h-full object-cover"
          />
          {watermarkType === "text" && (
            <div
              className="absolute"
              style={{
                fontSize: `${fontSize}px`,
                color: fontColor,
                fontFamily: fontStyle,
                opacity: opacity / 100,
                ...getPositionStyles(),
              }}
            >
              {watermarkText}
            </div>
          )}
          {watermarkType === "icon" && iconImg && (
            <img
              src={iconImg}
              alt="Watermark Icon"
              className="absolute"
              style={{
                width: `${fontSize}px`,
                height: `${fontSize}px`,
                opacity: opacity / 100,
                ...getPositionStyles(),
              }}
            />
          )}
        </div>

        {/* Controls */}
        <div className="space-y-4">
          <div className="flex items-center gap-6 flex-wrap">
            <label className="font-semibold">Watermark</label>
            <div className="flex items-center gap-2">
              <input
                type="radio"
                name="watermark"
                checked={watermarkType === "text"}
                onChange={() => setWatermarkType("text")}
              />
              <span>Text</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="radio"
                name="watermark"
                checked={watermarkType === "icon"}
                onChange={() => setWatermarkType("icon")}
              />
              <span>Icon</span>
            </div>
          </div>

          {watermarkType === "text" && (
            <>
              <div>
                <label className="font-semibold">Watermark Text</label>
                <input
                  type="text"
                  value={watermarkText}
                  onChange={(e) => setWatermarkText(e.target.value)}
                  className="w-full px-3 py-2 mt-1 rounded bg-white border border-slate-dark shadow"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold">Font Style</label>
                  <select
                    value={fontStyle}
                    onChange={(e) => setFontStyle(e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded bg-white border border-slate-dark shadow"
                  >
                    {fontStyles.map((style) => (
                      <option key={style} value={style}>
                        {style}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-semibold">Font Color</label>
                  <select
                    value={fontColor}
                    onChange={(e) => setFontColor(e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded bg-white border border-slate-dark shadow"
                  >
                    {fontColors.map((color) => (
                      <option key={color} value={color}>
                        {color}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          )}

          {watermarkType === "icon" && (
            <div>
              <label className="font-semibold">Upload Watermark Icon</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleIconUpload}
                className="mt-1"
              />
            </div>
          )}

          <div>
            <label className="font-semibold">Size</label>
            <input
              type="range"
              min="10"
              max="150"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="font-semibold">Opacity</label>
            <input
              type="range"
              min="0"
              max="100"
              value={opacity}
              onChange={(e) => setOpacity(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className=" font-semibold mb-1 block">Position</label>
            {renderPositionGrid()}
          </div>

          <button className="w-full mt-4 py-2 rounded bg-primary text-white hover:bg-primary-dark shadow">
            Save Preset
          </button>
        </div>
      </div>
    </div>
  );
};

export default WatermarkSetting;
