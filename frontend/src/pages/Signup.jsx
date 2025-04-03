import React, { useState } from "react";
import signupImg from "../assets/Signup.jpg";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [businessName, setBusinessName] = useState("");

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Left Side - Image */}
      <div
        className="w-full md:w-[30%] h-64 md:h-auto bg-cover bg-center"
        style={{ backgroundImage: `url(${signupImg})` }}
      ></div>

      {/* Right Side - Signup Form */}
      <div className="w-full md:w-[70%] flex justify-center items-center p-4 md:p-8">
        <div className="max-w-[90%] md:max-w-[70%] w-full">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Your Personal Information
          </h2>
          <p className="text-gray-600 text-lg md:text-xl mb-6">
            So we can know each other and share moments between us.
          </p>

          <form>
            <div className="mb-4">
              <input
                type="text"
                className="w-full p-3 border rounded mt-1"
                required
                placeholder="First and Last Name *"
              />
            </div>

            <div className="mb-4">
              <input
                type="email"
                className="w-full p-3 border rounded mt-1"
                required
                placeholder="Email Address *"
              />
            </div>

            <div className="mb-4">
              <input
                type="tel"
                className="w-full p-3 border rounded mt-1"
                placeholder="Phone"
              />
            </div>

            <div className="mb-4">
              <input
                type="text"
                className="w-full p-3 border rounded mt-1"
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Enter your Business Name *"
              />
            </div>

            <p className="text-gray-600 text-sm md:text-md mb-4">
              Your preview gallery URLs will start with <br />
              <span className="text-blue-600 font-semibold">
                https://{businessName || "your-business-name"}.wbook.in
              </span>
            </p>

            <div className="mb-4">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full p-3 border rounded mt-1"
                  required
                  placeholder="Password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-2 px-3 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-3 rounded mt-4"
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
