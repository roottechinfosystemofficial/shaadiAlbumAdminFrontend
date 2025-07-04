import React, { useState } from "react";
import Select from "react-select";
import countryList from "react-select-country-list";
import apiRequest from "../../utils/apiRequest";
import { USER_API_END_POINT } from "../../constant";
import toast from "../../utils/toast";
import { useSelector } from "react-redux";

const Business = () => {
      const { authUser, accessToken } = useSelector((state) => state.user);

      console.log("authUser buisness",authUser)

  const [email, setEmail] = useState(authUser?.email);
  const [phone, setPhone] = useState(authUser?.phoneNo);
  const [countryCode, setCountryCode] = useState("+91");
  const [password, setPassword] = useState("");
  const [country, setCountry] = useState(null);
  const [portfolio, setPortfolio] = useState("");
  const [bio, setBio] = useState("");
  

  const countryOptions = countryList().getData();

  const handleSubmit = async(e) => {
    e.preventDefault();

    const businessDetails = {
      email,
      phoneNo:phone,
      countryCode,
      password,
      country: country?.label || "",
      portfolio,
      bio,
    };

    try{
            const endpoint = `${USER_API_END_POINT}/edit-profile`;
      
      const res=await apiRequest("PUT",endpoint,{
        email,
        phoneNo:phone,

      })
      toast.success("Details Saved Successfully")

    }
    catch(err){
            toast.error("Something Went Wrong!!")


    }

    // TODO: send to backend via axios
  };

  return (
    <div className="p-4 md:p-6 shadow-xl rounded-lg bg-white">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Business Details</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col md:flex-row gap-6 md:gap-4 justify-center">
          {/* Left Box */}
          <div className="w-full md:w-1/2 bg-slate-100 p-4 md:p-6 rounded shadow">
            <div className="mb-6">
              <p className="text-gray-700 font-medium mb-2">Contact Email</p>
              <input
                type="email"
                placeholder="Enter contact email"
                className="w-full px-4 py-2 rounded outline-none border border-gray-300 bg-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-6">
              <p className="text-gray-700 font-medium mb-2">Phone</p>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter phone number"
                  className="w-full px-10 py-2 pr-28 border-b border-gray-400 bg-transparent focus:border-blue-600 focus:outline-none"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <div className="absolute top-1/2 -translate-y-1/2 right-2">
                  <button
                    type="button"
                    className="bg-gray-300 text-gray-800 px-2 py-1 rounded text-sm hover:bg-gray-400"
                  >
                    Update
                  </button>
                </div>
                <div className="absolute top-1/2 -translate-y-1/2 left-1">
                  <select
                    className="bg-transparent outline-none text-gray-700"
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                  >
                    <option value="+91">+91</option>
                    <option value="+1">+1</option>
                    <option value="+44">+44</option>
                    <option value="+61">+61</option>
                    <option value="+971">+971</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-gray-700 font-medium mb-2">Change Your Password</p>
              <input
                type="password"
                placeholder="Enter your new password"
                className="w-full px-4 py-2 rounded outline-none border border-gray-300 bg-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="mb-6">
              <p className="text-gray-700 font-medium mb-2">Country</p>
              <Select
                options={countryOptions}
                value={country}
                onChange={setCountry}
                className="bg-white text-gray-700"
                placeholder="Select Country"
              />
            </div>
          </div>

          {/* Right Box */}
          <div className="w-full md:w-1/2 bg-slate-100 p-4 md:p-6 rounded shadow">
            <div className="mb-6">
              <p className="text-gray-700 font-medium mb-2">Portfolio website</p>
              <div className="relative">
                <input
                  type="text"
                  placeholder="https://"
                  className="w-full px-10 py-2 pr-28 border-b border-gray-400 bg-transparent focus:border-blue-600 focus:outline-none"
                  value={portfolio}
                  onChange={(e) => setPortfolio(e.target.value)}
                />
                <div className="absolute top-1/2 -translate-y-1/2 right-2">
                  <button
                    type="button"
                    className="bg-gray-300 text-gray-800 px-2 py-1 rounded text-sm hover:bg-gray-400"
                  >
                    Update
                  </button>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-gray-700 font-medium mb-2">Bio</p>
              <textarea
                placeholder="Maximum 250 characters"
                className="w-full h-40 px-4 py-2 rounded border border-gray-300 bg-white outline-none"
                maxLength={250}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center mt-6">
          <button
            type="submit"
            className="bg-[#9C8769] text-white font-semibold px-6 py-3 rounded-lg hover:bg-[#7a6b4c] transition duration-200"
          >
            Save Business Details
          </button>
        </div>
      </form>
    </div>
  );
};

export default Business;
