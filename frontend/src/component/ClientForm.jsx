import React, { useState } from "react";
import { X } from "lucide-react";
import { CLIENTVU_API_END_POINT } from "../constant";
import apiRequest from "../utils/apiRequest";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";
const ClientForm = ({ onSubmit, onClose }) => {
  const { accessToken } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const { eventId } = useParams();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent submission if name is empty
    if (!formData.name.trim()) return;

    console.log("Form Data:", formData);

    try {
      const endpoint = `${CLIENTVU_API_END_POINT}/newClientViewUser`;

      const data = {
        ...formData,
        eventId,
      };

      const res = await apiRequest(
        "POST",
        endpoint,
        data,
        accessToken,
        dispatch
      );

      if (res.status === 201) {
        Cookies.set("clientViewToken", res.data.token, { expires: 1 });
      }

      onSubmit();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="h-full w-full flex items-center justify-center relative">
      {/* Close Button */}
      {onClose && (
        <button
          className="absolute top-2 right-2 text-slate hover:text-primary-dark transition"
          onClick={onClose}
        >
          <X className="w-6 h-6" />
        </button>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-2xl px-8 py-10 w-full max-w-md border border-slate"
      >
        {/* Heading */}
        <h2 className="text-3xl font-bold mb-6 text-center ">Register ✨</h2>
        <p className="text-center text-gray-700 mb-6">
          Hey there, please fill in your details below to create your account
          and join us!
        </p>
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          className="w-full px-4 py-3 mb-4 border border-slate-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full px-4 py-3 mb-4 border border-slate-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          className="w-full px-4 py-3 mb-4 border border-slate-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          value={formData.phone}
          onChange={handleChange}
        />

        <button
          type="submit"
          className="w-full bg-primary text-white font-medium py-3 rounded-lg hover:bg-primary-dark transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default ClientForm;
