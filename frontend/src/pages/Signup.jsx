import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { USER_API_END_POINT } from "../constant";
import toast from "../utils/toast.js";
import Loader from "../component/Loader.jsx";
import BtnLoader from "../component/Loader.jsx";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [businessName, setBusinessName] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const signupFun = async (e) => {
    e.preventDefault();
    setLoading(true);

    const slugBusinessName = businessName
      .trim()
      .replace(/\s+/g, "-")
      .toLowerCase();

    const signupData = {
      name,
      email,
      phone,
      businessName: slugBusinessName,
      password,
    };

    try {
      const endpoint = `${USER_API_END_POINT}/signup`;
      const res = await axios.post(endpoint, signupData);
      if (res.status === 200) {
        toast.success("Signup successful! 🎉");
        navigate("/login");
      }
    } catch (error) {
      console.error("Signup failed:", error);
      toast.error(
        error.response?.data?.message ||
          "An error occurred during signup. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#9C8769]">
      {/* Left Side */}
      <div className="hidden md:flex md:w-[40%] bg-[#9C8769] text-white items-center justify-center p-10">
        <div className="text-center space-y-6">
          <div className="text-6xl">📸</div>
          <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight">
            Welcome to Shaadi Album
          </h1>
          <p className="text-lg lg:text-xl opacity-90">
            A beautiful space to create, <br /> customize, and share your
            gallery.
          </p>
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div className="w-full md:w-[60%] flex justify-center items-center p-6 md:p-12 bg-white">
        <div className="w-full max-w-[500px]">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Your Personal Information
          </h2>
          <p className="text-gray-600 text-base mb-6">
            So we can know each other and share moments between us.
          </p>

          <form className="space-y-5" onSubmit={signupFun}>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9C8769]"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="First and Last Name *"
            />

            <input
              type="email"
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9C8769]"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address *"
            />

            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9C8769]"
              value={phone}
              onChange={(e) => {
                if (/^\d{0,10}$/.test(e.target.value)) {
                  setPhone(e.target.value);
                }
              }}
              placeholder="Phone"
              maxLength="10"
            />

            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9C8769]"
              required
              value={businessName}
              onChange={(e) => {
                const value = e.target.value;
                if (/^[a-zA-Z\s]*$/.test(value)) {
                  setBusinessName(value);
                }
              }}
              placeholder="Enter your Business Name *"
            />

            <p className="text-gray-600 text-sm">
              Your preview gallery URLs will start with:
              <br />
              <span className="text-[#9C8769] font-semibold">
                https://
                {(businessName.trim()
                  ? businessName.trim().replace(/\s+/g, "-")
                  : "your-business-name"
                ).toLowerCase()}
                .shaadialbum.in
              </span>
            </p>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9C8769]"
                required
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center text-sm text-[#9C8769] font-medium"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            <button
              type="button"
              className="text-[#9C8769] hover:underline"
              onClick={() => navigate("/login")}
            >
              Already Have an Account?
            </button>

            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center items-center gap-2 ${
                loading ? "bg-[#7A6A4A]" : "bg-[#9C8769]"
              } text-white font-semibold p-3 rounded-xl transition duration-200`}
            >
              {loading && <BtnLoader />}
              {loading ? "Submitting..." : "SIGNUP"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
