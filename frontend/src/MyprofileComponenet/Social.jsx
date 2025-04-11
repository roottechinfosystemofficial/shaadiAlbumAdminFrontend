import React from "react";
import {
  FaVimeo,
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
  FaTwitter,
} from "react-icons/fa";

const socialLinks = [
  { name: "Vimeo", icon: <FaVimeo className="text-xl text-sky-600" /> },
  { name: "Facebook", icon: <FaFacebook className="text-xl text-blue-600" /> },
  {
    name: "Instagram",
    icon: <FaInstagram className="text-xl text-pink-500" />,
  },
  { name: "LinkedIn", icon: <FaLinkedin className="text-xl text-blue-700" /> },
  { name: "YouTube", icon: <FaYoutube className="text-xl text-red-600" /> },
  { name: "Twitter", icon: <FaTwitter className="text-xl text-sky-400" /> },
];

const Social = () => {
  return (
    <div className="p-6 shadow-xl rounded-lg max-w-7xl mx-auto bg-white">
      {/* Heading */}
      <h1 className="text-2xl font-bold text-gray-800 mb-6 ">Social Links</h1>

      {/* Social Links Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 ">
        {socialLinks.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-4  p-4 rounded shadow w-full bg-white border border-gray-400"
          >
            {/* Icon */}
            <div className="w-10 h-10 flex items-center justify-center shrink-0">
              {item.icon}
            </div>

            {/* Input with Button */}
            <div className="relative w-full">
              <input
                type="text"
                placeholder={`https://${item.name.toLowerCase()}.com`}
                className="w-full px-4 py-2 pr-28 border-b border-gray-400 bg-transparent focus:border-primary focus:outline-none"
              />
              <div className="absolute top-1/2 -translate-y-1/2 right-2">
                <button className="bg-primary text-white px-3 py-1 rounded text-sm hover:bg-primary-dark transition">
                  Update
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Social;
