import React, { useState } from "react";

const Domain = () => {
  const [defaultDomain, setDefaultDomain] = useState("");
  const [customDomain, setCustomDomain] = useState("");

  return (
    <div className="p-4 md:p-6 shadow-xl rounded-lg">
      <h1 className="text-2xl border-b-2 border-indigo-50 pb-3 font-bold text-gray-800 mb-6">
        Domain
      </h1>

      <div className="flex flex-col md:flex-row gap-6 md:gap-4 justify-center">
        {/* Default Domain Box */}
        <div className="w-full md:w-1/2 p-4 md:p-6 rounded shadow relative bg-white">
          <span className="block text-gray-700 font-medium mb-2">
            User Name / Domain Name
          </span>
          <div className="relative">
            <input
              type="text"
              placeholder="Enter domain name"
              value={defaultDomain}
              onChange={(e) => setDefaultDomain(e.target.value)}
              className="w-full px-4 py-2 pr-28 border-b border-gray-400 bg-transparent focus:border-primary focus:outline-none"
            />
            {defaultDomain && (
              <div className="absolute top-1/2 -translate-y-1/2 right-2">
                <button className="bg-primary text-white px-2 py-1 rounded text-sm hover:bg-primary-dark transition">
                  Update
                </button>
              </div>
            )}
          </div>

          <div className="text-base md:text-lg text-gray-700 pt-5">
            <p>Your preview gallery URLs will start with</p>
            <a
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline break-all"
            >
              https://{defaultDomain || "yourname"}.Shaadialbum.com
            </a>
          </div>
        </div>

        {/* Custom Domain Box */}
        <div className="w-full md:w-1/2 p-4 md:p-6 rounded shadow relative bg-white">
          <span className="block text-gray-700 font-medium mb-2">
            Custom domain name
          </span>
          <div className="relative">
            <input
              type="text"
              placeholder="e.g. sub-domain.your-domain.com"
              value={customDomain}
              onChange={(e) => setCustomDomain(e.target.value)}
              className="w-full px-4 py-2 pr-28 border-b border-gray-400 bg-transparent focus:border-primary focus:outline-none"
            />
            {customDomain && (
              <div className="absolute top-1/2 -translate-y-1/2 right-2">
                <button className="bg-primary text-white px-2 py-1 rounded text-sm hover:bg-primary-dark transition">
                  Update
                </button>
              </div>
            )}
          </div>

          <div className="text-base md:text-lg text-gray-700 pt-5">
            <p>Point your CNAME entry record to</p>
            <a
              href={`https://${customDomain || "your.custom.domain"}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline break-all"
            >
              {customDomain
                ? `https://${customDomain}`
                : "https://your.custom.domain"}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Domain;
