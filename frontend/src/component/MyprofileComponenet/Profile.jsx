import MeProfile from "./MeProfile";
import { useSelector } from "react-redux";

// Main Profile Component
const Profile = () => {
  const { authUser } = useSelector((state) => state.user);

  return (
    <div className="flex h-full">
      {/* Left Side */}
      <div className="w-[30%] bg-gray-100 flex flex-col items-center p-4 shadow-md rounded-l-2xl">
        <img
          src={authUser?.logo || "https://via.placeholder.com/150"}
          alt="Profile"
          className="w-40 h-40 object-cover rounded-full border-4 border-red-500 mb-4"
        />
        <h1 className="text-2xl font-bold">{authUser?.name || "Your Name"}</h1>
        <p className="text-sm text-gray-600">{authUser?.email}</p>
        <p className="text-xs mt-1 bg-primary text-white px-3 py-1 rounded-full">
          {authUser?.role}
        </p>
      </div>

      {/* Right Side */}
      <div className="w-[70%] bg-white p-6 shadow-md rounded-r-2xl space-y-10">
        <div>
          <h2 className="text-xl font-bold mb-4 border-b pb-2">
            Profile Details
          </h2>
          <MeProfile />
        </div>
      </div>
    </div>
  );
};

export default Profile;
