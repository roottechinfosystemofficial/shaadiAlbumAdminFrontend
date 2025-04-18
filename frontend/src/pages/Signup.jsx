import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { USER_API_END_POINT } from "../constant";
import { useAuthCheck } from "../Hooks/useAuthCheckHook";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [businessName, setBusinessName] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  useAuthCheck();

  const signupFun = async (e) => {
    e.preventDefault();

    const slugBusinessName = businessName
      .trim()
      .replace(/\s+/g, "-")
      .toLowerCase();

    const signupData = {
      name: e.target[0].value,
      email: e.target[1].value,
      phone: phone,
      businessName: slugBusinessName,
      password: password,
    };

    try {
      const endpoint = `${USER_API_END_POINT}/signup`;
      const res = await axios.post(endpoint, signupData);
      if (res.status === 200) {
        navigate("/login");
      }
    } catch (error) {
      console.error("Signup failed:", error);
      alert("An error occurred during signup. Please try again.");
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#9C8769]">
      {/* Left Side - Clean and Classy */}
      <div className="hidden md:flex md:w-[40%] bg-[#9C8769] text-white items-center justify-center p-10">
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
              type="text" // Change to "text" so we can control the input manually
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9C8769]"
              value={phone}
              onChange={(e) => {
                // Ensure only numeric input and max length of 10 digits
                if (/^\d{0,10}$/.test(e.target.value)) {
                  setPhone(e.target.value);
                }
              }}
              placeholder="Phone"
              maxLength="10" // Optional: Enforces 10 characters at the HTML level
            />

            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9C8769]"
              required
              value={businessName}
              onChange={(e) => {
                const value = e.target.value;
                // Allow only letters and spaces
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
              className="text-[#9C8769] hover:underline"
              onClick={() => navigate("/login")}
            >
              Already Have an Account?
            </button>
            <button
              type="submit"
              className="w-full bg-[#9C8769] hover:bg-[#7A6A4A] text-white font-semibold p-3 rounded-xl transition duration-200"
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
