import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUser,
  FaQrcode,
  FaHeadset,
  FaFileInvoice,
  FaUserFriends,
} from "react-icons/fa";

const footerData = [
  {
    icon: <FaUser size={24} />,
    title: "Your Profile",
    description: "Manage and update your personal details.",
    link: "/profile",
  },
  {
    icon: <FaQrcode size={24} />,
    title: "UPIQR",
    description: "Easily generate and manage UPI QR codes.",
    link: "/upi-qr",
  },
  {
    icon: <FaHeadset size={24} />,
    title: "We Are Here for You",
    description: "Get support anytime you need assistance.",
    link: "/support",
  },
  {
    icon: <FaFileInvoice size={24} />,
    title: "Billing",
    description: "View and manage your billing details.",
    link: "/billing",
  },
  {
    icon: <FaUserFriends size={24} />,
    title: "Refer a Friend",
    description: "Invite your friends and earn rewards.",
    link: "/refer",
  },
];

const DashFooterBoxes = () => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 p-4">
      {footerData.map((item, index) => (
        <div
          key={index}
          className="bg-white shadow-lg rounded-lg p-4 flex items-center space-x-4 cursor-pointer border border-transparent 
          hover:bg-blue-50 hover:shadow-xl hover:border-blue-500 transition-all duration-300"
          onClick={() => navigate(item.link)}
        >
          <div className="text-blue-500">{item.icon}</div>
          <div>
            <h2 className="text-lg font-semibold">{item.title}</h2>
            <p className="text-gray-600 text-sm">{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashFooterBoxes;
