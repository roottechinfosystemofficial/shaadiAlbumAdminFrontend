import React, { useState, useEffect } from "react";
import { FaUserShield, FaCloudUploadAlt, FaLock } from "react-icons/fa";
import Logo from "../assets/logo_1.png";

const features = [
  {
    icon: <FaUserShield size={50} className="text-white" />,
    title: "Secure Access",
    description: "Your data is safe with end-to-end encryption.",
  },
  {
    icon: <FaCloudUploadAlt size={50} className="text-white" />,
    title: "Cloud Storage",
    description: "Access your files anytime from anywhere.",
  },
  {
    icon: <FaLock size={50} className="text-white" />,
    title: "Privacy Protection",
    description: "We ensure complete privacy and security.",
  },
];

const LoginPage = () => {
  const [featureIndex, setFeatureIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFeatureIndex((prevIndex) => (prevIndex + 1) % features.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-screen">
      {/* Left Side - Features Section (40%) */}
      <div className="relative w-[50%] bg-[red] text-white flex flex-col justify-center items-center p-10 overflow-hidden">
        {/* Features Section with Smooth Transition */}
        <div
          key={featureIndex}
          className="text-center transition-all duration-[1500ms] ease-in-out opacity-100 transform scale-105"
        >
          <div className="flex justify-center mb-4">
            {features[featureIndex].icon}
          </div>
          <h2 className="text-3xl font-bold">{features[featureIndex].title}</h2>
          <p className="mt-2 text-lg max-w-[80%] mx-auto">
            {features[featureIndex].description}
          </p>
        </div>
      </div>

      {/* Right Side - Login Form (60%) */}
      <div className="relative w-[50%] flex flex-col justify-center items-center p-10 ">
        <div
          className="absolute top-0 left-0 h-full w-[100px] bg-[red]"
          style={{ clipPath: "ellipse(100px 50% at 0% 50%)" }}
        ></div>
        {/* Logo */}
        <div className="mb-6">
          <img src={Logo} alt="Logo" className="w-24" />
        </div>

        {/* Login Form */}
        <form className="w-full max-w-sm">
          {/* Email Input */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Enter email address"
            />
          </div>

          {/* Password Input */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-1">
              Password
            </label>
            <input
              type="password"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Enter password"
            />
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex justify-between items-center mb-4 text-sm">
            <label className="flex items-center space-x-2 text-gray-600">
              <input type="checkbox" className="form-checkbox" />
              <span>Remember Me</span>
            </label>
            <a href="/forgot-password" className="text-red-500 hover:underline">
              Forgot Your Password?
            </a>
          </div>

          {/* Login Button */}
          <button className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition-all">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
