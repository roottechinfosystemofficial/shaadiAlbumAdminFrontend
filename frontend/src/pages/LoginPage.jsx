import React, { useState, useEffect } from "react";
import { FaUserShield, FaCloudUploadAlt, FaLock } from "react-icons/fa";
import { FiEye, FiEyeOff } from "react-icons/fi";
import Logo from "../assets/logo_1.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { USER_API_END_POINT } from "../constant";
import Cookies from "js-cookie";
import { useAuthCheck } from "../Hooks/useAuthCheckHook";

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
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  useAuthCheck();
  useEffect(() => {
    const interval = setInterval(() => {
      setFeatureIndex((prevIndex) => (prevIndex + 1) % features.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    const loginData = { email, password };
    const isProduction = import.meta.env.VITE_ENV === "production"; // Check if the environment is production

    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }

    try {
      const endpoint = `${USER_API_END_POINT}/login`;
      const res = await axios.post(endpoint, loginData);

      if (res.status === 200) {
        const { accessToken, refreshToken } = res.data.data;

        // 🍪 Set cookies with conditional 'secure' flag
        Cookies.set("accessToken", accessToken, {
          expires: 7, // expires in 7 days
          secure: isProduction, // Only secure in production
          sameSite: "Lax",
        });

        Cookies.set("refreshToken", refreshToken, {
          expires: 7, // expires in 7 days
          secure: isProduction, // Only secure in production
          sameSite: "Lax",
        });

        navigate("/"); // Redirect after successful login
      }
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login error. Try again.");
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden">
      {/* Left Side - Features Section */}
      <div className="relative w-full md:w-[45%] bg-primary text-white flex justify-center items-center px-6 py-12 sm:px-10 md:px-12">
        <div
          key={featureIndex}
          className="text-center transition-all duration-[1500ms] ease-in-out opacity-100 transform scale-105"
        >
          <div className="flex justify-center mb-4">
            {features[featureIndex].icon}
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">
            {features[featureIndex].title}
          </h2>
          <p className="mt-2 text-sm sm:text-base md:text-lg max-w-[90%] mx-auto">
            {features[featureIndex].description}
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="relative w-full md:w-[55%] flex justify-center items-center px-6 py-10 sm:px-12">
        <div
          className="hidden md:block absolute top-0 left-0 h-full w-[100px] bg-primary"
          style={{ clipPath: "ellipse(100px 50% at 0% 50%)" }}
        ></div>

        <div className="w-full max-w-sm z-10">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img src={Logo} alt="Logo" className="w-24 sm:w-32 md:w-36" />
          </div>

          {/* Form */}
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-4 relative">
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary pr-12"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[38px] text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 text-sm gap-2 sm:gap-0">
              <a
                href="/forgot-password"
                className="text-primary hover:underline"
              >
                Forgot Password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary/80 transition-all text-sm sm:text-base"
            >
              Login
            </button>
          </form>

          <div className="text-center mt-4">
            <button
              className="text-primary hover:underline text-sm sm:text-base"
              onClick={() => navigate("/signup")}
            >
              Don’t Have an Account?
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
