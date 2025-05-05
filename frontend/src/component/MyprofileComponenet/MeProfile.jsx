import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import apiRequest from "../../utils/apiRequest";
import { USER_API_END_POINT } from "../../constant";
import { setAuthUser } from "../../Redux/Slices/UserSlice";
import toast from "../../utils/toast.js";

const MeProfile = () => {
  const { authUser, accessToken } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [profileData, setProfileData] = useState({
    name: authUser?.name || "",
    address: authUser?.address || "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [changePassword, setChangePassword] = useState(false);
  const [isProfileChanged, setIsProfileChanged] = useState(false);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);

  // Sync profileData with updated authUser
  useEffect(() => {
    setProfileData({
      name: authUser?.name || "",
      address: authUser?.address || "",
    });
  }, [authUser]);

  // Track changes to profile fields
  useEffect(() => {
    const nameChanged = profileData.name.trim() !== (authUser?.name || "");
    const addressChanged =
      profileData.address.trim() !== (authUser?.address || "");
    setIsProfileChanged(nameChanged || addressChanged);
  }, [profileData, authUser]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    const trimmedValue = name === "name" ? value.trimStart() : value;
    setProfileData((prev) => ({ ...prev, [name]: trimmedValue }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsProfileLoading(true);

    const trimmedData = {
      name: profileData.name.trim(),
      address: profileData.address.trim(),
    };

    try {
      const endpoint = `${USER_API_END_POINT}/edit-profile`;
      const res = await apiRequest(
        "PUT",
        endpoint,
        trimmedData,
        accessToken,
        dispatch
      );

      if (res.status === 200) {
        dispatch(setAuthUser(res.data.data));
        toast.success("Profile updated successfully!");
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.message || "Failed to update profile.");
    } finally {
      setIsProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    setIsPasswordLoading(true);

    try {
      const endpoint = `${USER_API_END_POINT}/change-password`;
      const res = await apiRequest(
        "PUT",
        endpoint,
        passwordData,
        accessToken,
        dispatch
      );

      if (res.status === 200) {
        toast.success("Password updated successfully!");
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setChangePassword(false);
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.message || "Failed to update password.");
    } finally {
      setIsPasswordLoading(false);
    }
  };

  return (
    <div className="space-y-10 p-6">
      {/* Profile Update Form */}
      <form onSubmit={handleProfileSubmit} className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Profile Information
        </h2>

        {/* Name */}
        <div className="flex justify-between items-center">
          <label htmlFor="name" className="w-1/5 font-medium">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={profileData.name}
            onChange={handleProfileChange}
            className="w-4/5 border border-gray-300 rounded-lg px-4 py-2"
          />
        </div>

        {/* Email (read-only) */}
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
        <div className="flex justify-between items-center">
          <label htmlFor="address" className="w-1/5 font-medium">
            Address <span className="text-red-500">*</span>
          </label>
          <textarea
            id="address"
            name="address"
            value={profileData.address}
            onChange={handleProfileChange}
            className="w-4/5 h-24 border border-gray-300 rounded-lg px-4 py-2"
          />
        </div>

        {/* Submit */}
        <div className="text-right">
          <button
            type="submit"
            disabled={!isProfileChanged || isProfileLoading}
            className={`px-6 py-2 rounded-lg transition ${
              isProfileChanged && !isProfileLoading
                ? "bg-primary text-white hover:bg-primary-dark"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {isProfileLoading ? "Updating..." : "Update Profile"}
          </button>
        </div>
      </form>

      {/* Password Toggle */}
      <div className="flex items-center justify-between border-t pt-6 mt-6">
        <div>
          <h3 className="text-sm font-semibold text-gray-700">
            Change Password
          </h3>
          <p className="text-xs text-gray-500">
            Enable this to update your password.
          </p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            id="changePassword"
            checked={changePassword}
            onChange={(e) => setChangePassword(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-primary transition-colors"></div>
          <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-md transition-transform peer-checked:translate-x-full"></div>
        </label>
      </div>

      {/* Password Form */}
      {changePassword && (
        <form onSubmit={handlePasswordSubmit} className="space-y-6">
          {/* Current Password */}
          <div className="flex flex-col md:flex-row md:items-center">
            <label
              htmlFor="currentPassword"
              className="md:w-1/5 font-medium mb-1 md:mb-0"
            >
              Current Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="currentPassword"
              id="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              required
              autoComplete="current-password"
              className="w-full md:w-4/5 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>

          {/* New Password */}
          <div className="flex flex-col md:flex-row md:items-start">
            <label
              htmlFor="newPassword"
              className="md:w-1/5 font-medium pt-2 mb-1 md:mb-0"
            >
              New Password <span className="text-red-500">*</span>
            </label>
            <div className="w-full md:w-4/5 space-y-1">
              <input
                type="password"
                name="newPassword"
                id="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                required
                autoComplete="new-password"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col md:flex-row md:items-start">
            <label
              htmlFor="confirmPassword"
              className="md:w-1/5 font-medium pt-2 mb-1 md:mb-0"
            >
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <div className="w-full md:w-4/5 space-y-1">
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                required
                className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 ${
                  passwordData.confirmPassword &&
                  passwordData.newPassword !== passwordData.confirmPassword
                    ? "border-red-500 focus:ring-red-300"
                    : "border-gray-300 focus:ring-primary"
                }`}
              />
              {passwordData.confirmPassword &&
                passwordData.newPassword !== passwordData.confirmPassword && (
                  <p className="text-xs text-red-500">
                    🔁 Oops! Double-check that your new password and
                    confirmation are the same.
                  </p>
                )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-right">
            <button
              type="submit"
              disabled={
                !passwordData.currentPassword ||
                !passwordData.newPassword ||
                passwordData.newPassword !== passwordData.confirmPassword ||
                isPasswordLoading
              }
              className={`px-6 py-2 rounded-lg transition duration-200 focus:outline-none ${
                passwordData.newPassword === passwordData.confirmPassword &&
                passwordData.currentPassword &&
                !isPasswordLoading
                  ? "bg-primary text-white hover:bg-primary-dark focus:ring-2 focus:ring-primary"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {isPasswordLoading ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default MeProfile;
