const MyprofilePass = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Password successfully submitted!");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 relative">
      {/* Current Password */}
      <div className="flex items-center justify-between">
        <label htmlFor="currentPassword" className="w-1/5 font-medium">
          Current Password <span className="text-red-500">*</span>
        </label>
        <input
          id="currentPassword"
          name="currentPassword"
          type="password"
          placeholder="Enter current password"
          required
          className="w-4/5 border border-slate rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* New Password */}
      <div className="flex items-center justify-between">
        <label htmlFor="newPassword" className="w-1/5 font-medium">
          New Password <span className="text-red-500">*</span>
        </label>
        <input
          id="newPassword"
          name="newPassword"
          type="password"
          placeholder="Enter new password"
          required
          className="w-4/5 border border-slate rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Confirm Password */}
      <div className="flex items-center justify-between">
        <label htmlFor="confirmPassword" className="w-1/5 font-medium">
          Confirm Password <span className="text-red-500">*</span>
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          placeholder="Confirm new password"
          required
          className="w-4/5 border border-slate rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Submit Button */}
      <div className="pt-6 ml-[0%] relative">
        <button
          type="submit"
          className="bg-primary absolute left-[160px] text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default MyprofilePass;
