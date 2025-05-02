import React, { useState } from "react";
import { X } from "lucide-react"; // Optional: replace with your own icon if not using Lucide

const ClientForm = ({ onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    console.log("Form Data:", formData);
    onSubmit();
  };

  return (
    <div className="h-full w-full flex items-center justify-center relative">
      {/* Close Button */}
      {onClose && (
        <button
          className="absolute top-4 right-4 text-gray-600 hover:text-black"
          onClick={onClose}
        >
          <X className="w-6 h-6" />
        </button>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Please Fill the Form
        </h2>

        <input
          type="text"
          name="name"
          placeholder="Your Name"
          className="w-full px-4 py-2 border border-gray-300 rounded mb-4"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full px-4 py-2 border border-gray-300 rounded mb-4"
          value={formData.email}
          onChange={handleChange}
        />

        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          className="w-full px-4 py-2 border border-gray-300 rounded mb-4"
          value={formData.phone}
          onChange={handleChange}
        />

        <textarea
          name="message"
          placeholder="Your Message"
          className="w-full px-4 py-2 border border-gray-300 rounded mb-4 resize-none"
          rows="4"
          value={formData.message}
          onChange={handleChange}
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default ClientForm;
