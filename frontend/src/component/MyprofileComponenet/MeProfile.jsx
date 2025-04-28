const MeProfile = () => {
  const handleSubmit = () => {};
  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 relative">
      {/* First Name */}
      <div className="flex justify-between">
        <label htmlFor="firstName" className="w-1/5 font-medium">
          Name <span className="text-red-500">*</span>
        </label>
        <input
          id="firstName"
          name="firstName"
          type="text"
          placeholder="Your"
          required
          className="w-4/5 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Username */}
      

      {/* Mobile Number */}
      <div className="flex items-center justify-between">
        <label htmlFor="mobileNumber" className="w-1/5 font-medium">
          Mobile Number <span className="text-red-500">*</span>
        </label>
        <input
          id="mobileNumber"
          name="mobileNumber"
          type="text"
          placeholder="987654321"
          required
          className="w-4/5 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
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
          placeholder="Your Address"
          required
          className="w-4/5 h-24 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Watermark Option */}

      <div className="pt-6 ml-[0%] relative">
        <button
          name="form_submit"
          type="submit"
          className="bg-primary absolute left-[160px] text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default MeProfile;
