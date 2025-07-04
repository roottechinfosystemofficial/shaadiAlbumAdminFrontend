import React, { useEffect } from "react";
import sampleImg from "../../assets/client/photo-1478760329108-5c3ed9d495a0.jpg";
import { useDispatch, useSelector } from "react-redux";
import apiRequest from "../../utils/apiRequest";
import toast from "../../utils/toast";
import { setSettings } from "../../Redux/Slices/SettingSlice";
import { SETTINGS_API_END_POINTS } from "../../constant";

const WatermarkSetting = () => {
  const dispatch = useDispatch();
  const { accessToken, authUser } = useSelector((state) => state.user);
  const settingState = useSelector((state) => state.settings.settingState);

  const fontColors = ["white", "black", "gray", "red", "blue"];
  const fontStyles = ["Arial", "Times New Roman", "Courier New", "Verdana"];
  const positions = [
    "top-left", "top-center", "top-right",
    "center-left", "center", "center-right",
    "bottom-left", "bottom-center", "bottom-right"
  ];

  // useEffect(() => {
  //   const fetchSettings = async () => {
  //     try {
  //       const response = await apiRequest(
  //         "GET",
  //         `${SETTINGS_API_END_POINTS}/get-setting/${authUser?._id}`,
  //         null,
  //         accessToken,
  //         dispatch
  //       );
  //       const settings = response?.data?.data;
  //       if (settings) dispatch(setSettings(settings));
  //     } catch (err) {
  //       console.error("Error fetching settings:", err);
  //     }
  //   };
  //   fetchSettings();
  // }, [authUser?._id]);

  const updateSetting = (key, value) => {
    dispatch(setSettings({ ...settingState, [key]: value }));
  };

  const handleIconUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateSetting("iconImg", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    const body = {
      ...settingState,
      userId: authUser?._id,
    };
    try {
      await apiRequest(
        "POST",
        `${SETTINGS_API_END_POINTS}/save-settings`,
        body,
        accessToken,
        dispatch
      );
      dispatch(setSettings(body));
      toast.success("Settings saved successfully ✅");
    } catch (err) {
      toast.error("Failed to save settings ❌");
      console.error("Save error:", err);
    }
  };

  const getPositionStyles = () => {
    const styleMap = {
      "top-left": { top: "5%", left: "5%" },
      "top-center": { top: "5%", left: "50%", transform: "translateX(-50%)" },
      "top-right": { top: "5%", right: "5%" },
      "center-left": { top: "50%", left: "5%", transform: "translateY(-50%)" },
      center: { top: "50%", left: "50%", transform: "translate(-50%, -50%)" },
      "center-right": { top: "50%", right: "5%", transform: "translateY(-50%)" },
      "bottom-left": { bottom: "5%", left: "5%" },
      "bottom-center": { bottom: "5%", left: "50%", transform: "translateX(-50%)" },
      "bottom-right": { bottom: "5%", right: "5%" },
    };
    return styleMap[settingState.position] || {};
  };

  const renderPositionGrid = () => (
    <div className="grid grid-cols-3 sm:grid-cols-3 gap-2">
      {positions.map((pos) => (
        <button
          key={pos}
          onClick={() => updateSetting("position", pos)}
          className={`py-2 px-2 rounded text-xs text-center border ${
            settingState.position === pos
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
        <div className="relative w-full aspect-video rounded overflow-hidden shadow border border-slate-dark bg-white">
          <img  src={sampleImg} alt="preview" className="w-full h-full object-cover" />
          {settingState.watermarkType === "text" && (
            <div
              className="absolute"
              style={{
                fontSize: `${settingState.fontSize}px`,
                color: settingState.fontColor,
                fontFamily: settingState.fontStyle,
                opacity: settingState.opacity / 100,
                ...getPositionStyles(),
              }}
            >
              {settingState.watermarkText}
            </div>
          )}
          {settingState.watermarkType === "icon" && settingState.iconImg && (
            <img
              src={settingState.iconImg}
              alt="Watermark Icon"
              className="absolute"
              style={{
                width: `${settingState.iconSize}px`,
                height: `${settingState.iconSize}px`,
                opacity: settingState.opacity / 100,
                ...getPositionStyles(),
              }}
            />
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-6 flex-wrap">
            <label className="font-semibold">Watermark</label>
            <div className="flex items-center gap-2">
              <input type="radio" name="watermark" checked={settingState.watermarkType === "text"} onChange={() => updateSetting("watermarkType", "text")} />
              <span>Text</span>
            </div>
            <div className="flex items-center gap-2">
              <input type="radio" name="watermark" checked={settingState.watermarkType === "icon"} onChange={() => updateSetting("watermarkType", "icon")} />
              <span>Icon</span>
            </div>
          </div>

          {settingState.watermarkType === "text" && (
            <>
              <div>
                <label className="font-semibold">Watermark Text</label>
                <input
                  type="text"
                  value={settingState.watermarkText}
                  onChange={(e) => updateSetting("watermarkText", e.target.value)}
                  className="w-full px-3 py-2 mt-1 rounded bg-white border border-slate-dark shadow"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold">Font Style</label>
                  <select
                    value={settingState.fontStyle}
                    onChange={(e) => updateSetting("fontStyle", e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded bg-white border border-slate-dark shadow"
                  >
                    {fontStyles.map((style) => <option key={style} value={style}>{style}</option>)}
                  </select>
                </div>
                <div>
                  <label className="font-semibold">Font Color</label>
                  <select
                    value={settingState.fontColor}
                    onChange={(e) => updateSetting("fontColor", e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded bg-white border border-slate-dark shadow"
                  >
                    {fontColors.map((color) => <option key={color} value={color}>{color}</option>)}
                  </select>
                </div>
                
              </div>
              <div className="mt-10">
              <label className="font-semibold">Size</label>
            <input
              type="range"
              min="10"
              max="150"
              value={settingState.fontSize}
              onChange={(e) => {updateSetting("fontSize", Number(e.target.value));console.log(e.target.value)}}
              className="w-full"
            />
            </div>
            </>
          )}

          {settingState.watermarkType === "icon" && (
            <div>
              <label className="font-semibold">Upload Watermark Icon</label>
              
              <input type="file" accept="image/*" onChange={handleIconUpload} className="mt-1" />
               <div>
            <label className="font-semibold">Size</label>
            <input
              type="range"
              min="10"
              max="150"
              value={settingState.iconSize}
              onChange={(e) => {updateSetting("iconSize", Number(e.target.value));console.log(e.target.value)}}
              className="w-full"
            />
          </div>
            </div>
          )}

         

          <div>
            <label className="font-semibold">Opacity</label>
            <input
              type="range"
              min="0"
              max="100"
              value={settingState.opacity}
              onChange={(e) => updateSetting("opacity", Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="font-semibold mb-1 block">Position</label>
            {renderPositionGrid()}
          </div>

          <button onClick={handleSave} className="w-full mt-4 py-2 rounded bg-primary text-white hover:bg-primary-dark shadow">
            Save Preset
          </button>
        </div>
      </div>
    </div>
  );
};

export default WatermarkSetting;
