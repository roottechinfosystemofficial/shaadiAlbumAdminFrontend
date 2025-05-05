import { useState } from "react";
import { useSelector } from "react-redux";

const MeProfile = () => {
  const { authUser } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    name: authUser?.name || "",
    address: authUser?.address || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [changePassword, setChangePassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setChangePassword(checked);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (changePassword) {
      if (formData.newPassword !== formData.confirmPassword) {
        alert("New passwords do not match!");
        return;
      }
      // Add password validation or API call here
    }

    console.log("Submitting form:", {
      ...formData,
      email: authUser?.email,
      changePassword,
    });

    // TODO: Send updated data to backend
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6">
      {/* Name */}
      <div className="flex justify-between items-center">
        <label htmlFor="name" className="w-1/5 font-medium">
          Name <span className="text-red-500">*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-4/5 border border-gray-300 rounded-lg px-4 py-2"
        />
      </div>

      {/* Email (Read Only) */}
      <div className="flex justify-between items-center">
        <label htmlFor="email" className="w-1/5 font-medium">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={authUser?.email || ""}
          disabled
          className="w-4/5 border border-gray-200 bg-gray-100 text-gray-600 rounded-lg px-4 py-2 cursor-not-allowed"
        />
      </div>

      {/* Address */}
      <div className="flex justify-between">
        <label htmlFor="address" className="w-1/5 font-medium">
          Address <span className="text-red-500">*</span>
        </label>
        <textarea
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          required
          className="w-4/5 h-24 border border-gray-300 rounded-lg px-4 py-2"
        />
      </div>

      {/* Toggle Password Change */}
      <div className="flex items-center gap-10 border-t pt-6 mt-6">
        <div>
          <label
            htmlFor="changePassword"
            className="block text-sm font-semibold text-gray-800"
          >
            Change Password
          </label>
          <p className="text-xs text-gray-500">
            Toggle this switch if you'd like to update your password.
          </p>
        </div>

        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            id="changePassword"
            checked={changePassword}
            onChange={handleChange}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:bg-primary transition-colors"></div>
          <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-md transition-transform peer-checked:translate-x-full"></div>
        </label>
      </div>

      {/* Password Fields */}
      {changePassword && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label htmlFor="currentPassword" className="w-1/5 font-medium">
              Current Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="currentPassword"
              id="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              required
              className="w-4/5 border border-gray-300 rounded-lg px-4 py-2"
            />
          </div>

          <div className="flex justify-between items-center">
            <label htmlFor="newPassword" className="w-1/5 font-medium">
              New Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="newPassword"
              id="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              required
              className="w-4/5 border border-gray-300 rounded-lg px-4 py-2"
            />
          </div>

          <div className="flex justify-between items-center">
            <label htmlFor="confirmPassword" className="w-1/5 font-medium">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-4/5 border border-gray-300 rounded-lg px-4 py-2"
            />
          </div>
        </div>
      )}

      {/* Submit Button */}
      <div className="pt-6 text-center">
        <button
          type="submit"
          className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default MeProfile;
