import { useState } from "react";

const MeProfile = () => {
  const [watermark, setWatermark] = useState("none");
  const [opacity, setOpacity] = useState(50);
  const [position, setPosition] = useState("0");
  const [imagePreview, setImagePreview] = useState(null);
  const [watermarkText, setWatermarkText] = useState("");

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (watermark === "center" && watermarkText.trim() === "") {
      alert("Please enter watermark text.");
      return;
    }

    if (watermark === "bottomRight" && !imagePreview) {
      alert("Please upload a watermark image.");
      return;
    }

    alert("Form submitted!");
  };

  const getLeftPosition = (val) => {
    const percent = (val - 0) / (100 - 0);
    return `calc(${percent * 100}% - 20px)`;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 relative">
      {/* First Name */}
      <div className="flex justify-between">
        <label htmlFor="firstName" className="w-1/5 font-medium">
          First Name <span className="text-red-500">*</span>
        </label>
        <input
          id="firstName"
          name="firstName"
          type="text"
          placeholder="Your"
          required
          className="w-4/5 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Last Name */}
      <div className="flex items-center justify-between">
        <label htmlFor="lastName" className="w-1/5 font-medium">
          Last Name <span className="text-red-500">*</span>
        </label>
        <input
          id="lastName"
          name="lastName"
          type="text"
          placeholder="Business"
          required
          className="w-4/5 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Username */}
      <div className="flex items-center justify-between">
        <label htmlFor="username" className="w-1/5 font-medium">
          Username <span className="text-red-500">*</span>
        </label>
        <input
          id="username"
          name="username"
          type="text"
          placeholder="username@example.com"
          required
          className="w-4/5 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Mobile Number */}
      <div className="flex items-center justify-between">
        <label htmlFor="mobileNumber" className="w-1/5 font-medium">
          Mobile Number <span className="text-red-500">*</span>
        </label>
        <input
          id="mobileNumber"
          name="mobileNumber"
          type="text"
          placeholder="987654321"
          required
          className="w-4/5 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Address */}
      <div className="flex justify-between">
        <label htmlFor="address" className="w-1/5 font-medium">
          Address <span className="text-red-500">*</span>
        </label>
        <textarea
          id="address"
          name="address"
          placeholder="Your Address"
          required
          className="w-4/5 h-24 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Watermark Option */}
      <div>
        <div className="flex items-start gap-4 mb-4">
          <label className="w-1/5 font-medium">
            Add Watermark <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-col sm:flex-row gap-4 w-4/5">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="watermark"
                value="none"
                checked={watermark === "none"}
                onChange={() => setWatermark("none")}
                className="accent-primary"
              />
              No Watermark
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="watermark"
                value="center"
                checked={watermark === "center"}
                onChange={() => setWatermark("center")}
                className="accent-primary"
              />
              Text
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="watermark"
                value="bottomRight"
                checked={watermark === "bottomRight"}
                onChange={() => setWatermark("bottomRight")}
                className="accent-primary"
              />
              Icon
            </label>
          </div>
        </div>

        {(watermark === "center" || watermark === "bottomRight") && (
          <div className="flex flex-col sm:flex-row gap-6 px-4 py-10 border rounded-xl shadow-md bg-gray-50 w-4/5 ml-auto">
            <div className="sm:w-1/2 space-y-6">
              {/* Watermark Position */}
              <select
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-10"
              >
                <option value="0">Select Position</option>
                <option value="1">Left Top</option>
                <option value="2">Left Middle</option>
                <option value="3">Left Bottom</option>
                <option value="4">Middle Top</option>
                <option value="5">Middle Middle</option>
                <option value="6">Middle Bottom</option>
                <option value="7">Right Top</option>
                <option value="8">Right Middle</option>
                <option value="9">Right Bottom</option>
              </select>

              {/* Opacity Slider */}
              <div className="relative w-full">
                <div
                  className="absolute -top-5 text-white text-xs bg-primary px-2 py-1 rounded shadow-md transition-all"
                  style={{ left: getLeftPosition(opacity) }}
                >
                  {opacity}%
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={opacity}
                  onChange={(e) => setOpacity(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>

              {/* Watermark Input */}
              {watermark === "center" ? (
                <input
                  type="text"
                  placeholder="Enter watermark text"
                  value={watermarkText}
                  onChange={(e) => setWatermarkText(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              ) : (
                <div className="w-full">
                  <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-primary transition">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      id="watermark-upload"
                      onChange={handleImageUpload}
                    />
                    <label
                      htmlFor="watermark-upload"
                      className="text-primary cursor-pointer"
                    >
                      Click or Drag Image Here
                    </label>
                    <p className="text-xs text-gray-500 mt-2">
                      PNG, JPG up to 2MB
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Image Preview */}
            <div className="sm:w-1/2 flex justify-center items-center">
              <img
                src={imagePreview || "./public/sample.jpg"}
                alt="preview"
                className="max-h-48 object-cover rounded shadow"
              />
            </div>
          </div>
        )}
      </div>

      <div className="pt-6 ml-[0%] relative">
        <button
          name="form_submit"
          type="submit"
          className="bg-primary absolute left-[160px] text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default MeProfile;
