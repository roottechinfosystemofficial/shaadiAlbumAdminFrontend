import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [businessName, setBusinessName] = useState("");
  const navigate = useNavigate();

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Left Side - Clean and Classy */}
      <div className="hidden md:flex md:w-[40%] bg-red-600 text-white items-center justify-center p-10">
        <div className="text-center space-y-6">
          {/* Icon */}
          <div className="text-6xl">📸</div>

          {/* Headline */}
          <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight">
            Welcome to Shaadi Album
          </h1>

          {/* Description */}
          <p className="text-lg lg:text-xl opacity-90">
            A beautiful space to create, <br /> customize, and share your
            gallery.
          </p>
        </div>
      </div>

      {/* Right Side - Signup Form (No shadow) */}
      <div className="w-full md:w-[60%] flex justify-center items-center p-6 md:p-12 bg-white">
        <div className="w-full max-w-[500px]">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Your Personal Information
          </h2>
          <p className="text-gray-600 text-base mb-6">
            So we can know each other and share moments between us.
          </p>

          <form className="space-y-5">
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
              required
              placeholder="First and Last Name *"
            />

            <input
              type="email"
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
              required
              placeholder="Email Address *"
            />

            <input
              type="tel"
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Phone"
            />

            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
              required
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="Enter your Business Name *"
            />

            <p className="text-gray-600 text-sm">
              Your preview gallery URLs will start with:
              <br />
              <span className="text-red-600 font-semibold">
                https://{businessName || "your-business-name"}.shaadialbum.in
              </span>
            </p>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                required
                placeholder="Password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center text-sm text-red-500 font-medium"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <button
              className="text-red-600 hover:underline"
              onClick={() => navigate("/login")}
            >
              Alredy Have Account?
            </button>
            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold p-3 rounded-xl transition duration-200"
            >
              SUBMIT
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
