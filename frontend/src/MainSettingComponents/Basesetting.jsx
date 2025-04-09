import React, { useState } from "react";

const Basesetting = () => {
  const [logo, setLogo] = useState(null);
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [address, setAddress] = useState("");
  const [mapLink, setMapLink] = useState("");

  // Social Settings State
  const [facebookUrl, setFacebookUrl] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");

  // Custom Domain Settings State
  const [isPremiumUser, setIsPremiumUser] = useState(false); 
  const [customDomain, setCustomDomain] = useState("");

  // Handle logo file selection
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogo(URL.createObjectURL(file)); // Preview the selected logo
    }
  };

  // Handle Business Settings form submission
  const handleBusinessSettingsSubmit = (e) => {
    e.preventDefault();

    // Validate required fields for Business Settings
    if (!businessName || !email || !contactNo || !address) {
      alert("Please fill in all required fields in the Business Settings.");
      return;
    }

    // Handle Business Settings form submission (e.g., sending data to an API)
    console.log({
      businessName,
      email,
      contactNo,
      address,
      mapLink,
      logo,
    });

    alert("Business Settings saved!");
  };

  // Handle Social Settings form submission
  const handleSocialSettingsSubmit = (e) => {
    e.preventDefault();

    // Validate required fields for Social Settings
    if (!facebookUrl || !instagramUrl || !youtubeUrl) {
      alert("Please fill in all required fields in the Social Settings.");
      return;
    }

   
    console.log({
      facebookUrl,
      instagramUrl,
      youtubeUrl,
      whatsappNumber,
      customDomain,
    });

    alert("Social Settings saved!");
  };

  // Handle Custom Domain Form submission
  const handleCustomDomainSubmit = (e) => {
    e.preventDefault();
    // Validate Custom Domain for Premium Users
    if (isPremiumUser && !customDomain) {
      alert("Please enter your custom domain.");
      return;
    }

    // Handle Custom Domain form submission (e.g., sending data to an API)
    console.log({
      customDomain,
    });

    alert("Custom Domain settings saved!");
  };

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-xl p-8 shadow-lg">
      <h2 className="text-3xl font-semibold text-gray-800 mb-8">Settings</h2>

      {/* Business Settings Form */}
      <div className="bg-gray-50 p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-2xl font-semibold text-gray-800 mb-6">
          Business Settings
        </h3>
        <form onSubmit={handleBusinessSettingsSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Business Name */}
            <div>
              <label className="block text-lg font-medium mb-2 text-gray-700">
                Business Name *
              </label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Business Name"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>

            {/* Support Email Address */}
            <div>
              <label className="block text-lg font-medium mb-2 text-gray-700">
                Support Email Address *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="youremail@gmail.com"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>

            {/* Support Contact No. */}
            <div>
              <label className="block text-lg font-medium mb-2 text-gray-700">
                Support Contact No. *
              </label>
              <input
                type="text"
                value={contactNo}
                onChange={(e) => setContactNo(e.target.value)}
                placeholder="9876543210"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>

            {/* Office Address */}
            <div>
              <label className="block text-lg font-medium mb-2 text-gray-700">
                Office Address *
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Your Address"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>

            {/* Map Link */}
            <div>
              <label className="block text-lg font-medium mb-2 text-gray-700">
                MapLink - Contact Us Page
              </label>
              <input
                type="text"
                value={mapLink}
                onChange={(e) => setMapLink(e.target.value)}
                placeholder="Google Map Link"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>

            {/* Logo Upload */}
            <div>
              <label className="block text-lg font-medium mb-2 text-gray-700">
                Logo Image
              </label>
              <input
                type="file"
                onChange={handleLogoChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
              {/* Logo Preview */}
              {logo && (
                <div className="mt-4">
                  <img
                    src={logo}
                    alt="Logo Preview"
                    className="max-w-full h-32 object-contain rounded-md border border-gray-300 shadow-md"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Business Settings Submit Button */}
          <div className="col-span-full flex justify-end mt-6">
            <button
              type="submit"
              className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Save Business Settings
            </button>
          </div>
        </form>
      </div>

      {/* Social Settings Form */}
      <div className="bg-gray-50 p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-2xl font-semibold text-gray-800 mb-6">
          Social Settings
        </h3>
        <form onSubmit={handleSocialSettingsSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Facebook URL */}
            <div>
              <label className="block text-lg font-medium mb-2 text-gray-700">
                Facebook URL *
              </label>
              <input
                type="url"
                value={facebookUrl}
                onChange={(e) => setFacebookUrl(e.target.value)}
                placeholder="https://facebook.com/"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>

            {/* Instagram URL */}
            <div>
              <label className="block text-lg font-medium mb-2 text-gray-700">
                Instagram URL *
              </label>
              <input
                type="url"
                value={instagramUrl}
                onChange={(e) => setInstagramUrl(e.target.value)}
                placeholder="https://www.instagram.com/"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>

            {/* YouTube URL */}
            <div>
              <label className="block text-lg font-medium mb-2 text-gray-700">
                YouTube URL *
              </label>
              <input
                type="url"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="https://www.youtube.com/"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>

            {/* WhatsApp Phone Number */}
            <div>
              <label className="block text-lg font-medium mb-2 text-gray-700">
                WhatsApp Phone Number
              </label>
              <input
                type="tel"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="WhatsApp Phone Number"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>
          </div>

          {/* Social Settings Submit Button */}
          <div className="col-span-full flex justify-end mt-6">
            <button
              type="submit"
              className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Save Social Settings
            </button>
          </div>
        </form>
      </div>

      {/* Custom Domain Form */}
      <div className="bg-gray-50 p-6 rounded-lg shadow-md">
        <h3 className="text-2xl font-semibold text-gray-800 mb-6">
          Custom Domain Settings
        </h3>
        <form onSubmit={handleCustomDomainSubmit}>
          <div>
            <label className="block text-lg font-medium mb-2 text-gray-700">
              Custom Domain
            </label>
            {isPremiumUser ? (
              <input
                type="text"
                value={customDomain}
                onChange={(e) => setCustomDomain(e.target.value)}
                placeholder="yourbusinessname.com"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            ) : (
              <p className="text-sm text-gray-500">
                For Free Users: sagai.wbook.in
              </p>
            )}
          </div>

          {/* Custom Domain Submit Button */}
          <div className="flex justify-end mt-6">
            <button
              type="submit"
              className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Save Custom Domain Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Basesetting;
