import React from "react";

const Business = () => {
  return (
    <div className="p-4 md:p-6 shadow-xl rounded-lg">
      {/* Top Heading */}
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Business Details
      </h1>

      {/* Responsive Flex Container */}
      <div className="flex flex-col md:flex-row gap-6 md:gap-4 justify-center">
        {/* Left Box */}
        <div className="w-full md:w-1/2 bg-slate-100 p-4 md:p-6 rounded shadow">
          <div className="mb-6 md:mb-8">
            <p className="text-gray-700 font-medium mb-2">Contact Email</p>
            <input
              type="email"
              placeholder="Enter contact email"
              className="w-full px-4 py-2 rounded outline-none focus:ring-0 border border-gray-300 bg-white"
            />
          </div>

          <div className="mb-6 md:mb-8">
            <p className="text-gray-700 font-medium mb-2">Phone</p>
            <div className="relative">
              <input
                type="text"
                placeholder="Enter phone number"
                className="w-full px-10 py-2 pr-28 border-b border-gray-400 bg-transparent focus:border-blue-600 focus:outline-none"
              />
              <div className="absolute top-1/2 -translate-y-1/2 right-2">
                <button className="bg-gray-300 text-gray-800 px-2 py-1 rounded text-sm hover:bg-gray-400">
                  Update
                </button>
              </div>
              <div className="absolute top-1/2 -translate-y-1/2 left-1">
                <select className="bg-transparent outline-none text-gray-700">
                  <option value="+91">+91</option>
                  <option value="+1">+1</option>
                  <option value="+44">+44</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mb-6 md:mb-8">
            <p className="text-gray-700 font-medium mb-2">
              Change Your Password
            </p>
            <input
              type="password"
              placeholder="Enter your new password"
              className="w-full px-4 py-2 rounded outline-none border border-gray-300 bg-white focus:ring-0"
            />
          </div>

          <div className="mb-6 md:mb-8">
            <p className="text-gray-700 font-medium mb-2">Country</p>
            <select className="bg-white border border-gray-300 outline-none text-gray-700 px-4 py-2 w-full rounded">
              <option value="">Select Country</option>
              <option value="AF">Afghanistan</option>
              <option value="AX">Åland Islands</option>
              <option value="AL">Albania</option>
              <option value="DZ">Algeria</option>
              <option value="AS">American Samoa</option>
              <option value="AD">Andorra</option>
              <option value="AO">Angola</option>
              <option value="AI">Anguilla</option>
              <option value="AQ">Antarctica</option>
              <option value="AG">Antigua and Barbuda</option>
              <option value="AR">Argentina</option>
              <option value="AM">Armenia</option>
              <option value="AW">Aruba</option>
              <option value="AU">Australia</option>
              <option value="AT">Austria</option>
              <option value="AZ">Azerbaijan</option>
            </select>
          </div>
        </div>

        {/* Right Box */}
        <div className="w-full md:w-1/2 bg-slate-100 p-4 md:p-6 rounded shadow">
          <div className="mb-6 md:mb-8">
            <p className="text-gray-700 font-medium mb-2">Portfolio website</p>
            <div className="relative">
              <input
                type="text"
                placeholder="https://"
                className="w-full px-10 py-2 pr-28 border-b border-gray-400 bg-transparent focus:border-blue-600 focus:outline-none"
              />
              <div className="absolute top-1/2 -translate-y-1/2 right-2">
                <button className="bg-gray-300 text-gray-800 px-2 py-1 rounded text-sm hover:bg-gray-400">
                  Update
                </button>
              </div>
            </div>
          </div>

          <div className="mb-6 md:mb-8">
            <p className="text-gray-700 font-medium mb-2">Bio</p>
            <textarea
              placeholder="Maximum 250 characters"
              className="w-full h-40 px-4 py-2 rounded border border-gray-300 bg-white outline-none focus:ring-0"
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Business;
