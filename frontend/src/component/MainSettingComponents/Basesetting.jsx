import React, { useState } from "react";

const Basesetting = () => {
  const [logo, setLogo] = useState(null);
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [address, setAddress] = useState("");
  const [mapLink, setMapLink] = useState("");
  const [facebookUrl, setFacebookUrl] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [isPremiumUser, setIsPremiumUser] = useState(false);
  const [customDomain, setCustomDomain] = useState("");

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) setLogo(URL.createObjectURL(file));
  };

  const handleBusinessSettingsSubmit = (e) => {
    e.preventDefault();
    if (!businessName || !email || !contactNo || !address) {
      alert("Please fill in all required fields in the Business Settings.");
      return;
    }
    console.log({ businessName, email, contactNo, address, mapLink, logo });
    alert("Business Settings saved!");
  };

  const handleSocialSettingsSubmit = (e) => {
    e.preventDefault();
    if (!facebookUrl || !instagramUrl || !youtubeUrl) {
      alert("Please fill in all required fields in the Social Settings.");
      return;
    }
    console.log({ facebookUrl, instagramUrl, youtubeUrl, whatsappNumber });
    alert("Social Settings saved!");
  };

  const handleCustomDomainSubmit = (e) => {
    e.preventDefault();
    if (isPremiumUser && !customDomain) {
      alert("Please enter your custom domain.");
      return;
    }
    console.log({ customDomain });
    alert("Custom Domain settings saved!");
  };

  const inputStyle =
    "w-full p-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary";

  return (
    <div className="max-w-6xl mx-auto bg-background rounded-xl p-8 shadow-lg">
      <h2 className="text-3xl font-semibold text-primary mb-8">Settings</h2>

      {/* Business Settings */}
      <Section title="Business Settings">
        <form onSubmit={handleBusinessSettingsSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Input
              label="Business Name *"
              value={businessName}
              onChange={setBusinessName}
              placeholder="Business Name"
            />
            <Input
              label="Support Email Address *"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="youremail@gmail.com"
            />
            <Input
              label="Support Contact No. *"
              value={contactNo}
              onChange={setContactNo}
              placeholder="9876543210"
            />
            <Input
              label="Office Address *"
              value={address}
              onChange={setAddress}
              placeholder="Your Address"
            />
            <Input
              label="MapLink - Contact Us Page"
              value={mapLink}
              onChange={setMapLink}
              placeholder="Google Map Link"
            />
            <div>
              <Label>Logo Image</Label>
              <input
                type="file"
                onChange={handleLogoChange}
                className={inputStyle}
              />
              {logo && (
                <img
                  src={logo}
                  alt="Logo"
                  className="mt-4 h-32 object-contain border rounded-md shadow-md"
                />
              )}
            </div>
          </div>
          <SubmitButton label="Save Business Settings" />
        </form>
      </Section>

      {/* Social Settings */}
      <Section title="Social Settings">
        <form onSubmit={handleSocialSettingsSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Input
              label="Facebook URL *"
              value={facebookUrl}
              onChange={setFacebookUrl}
              placeholder="https://facebook.com/"
            />
            <Input
              label="Instagram URL *"
              value={instagramUrl}
              onChange={setInstagramUrl}
              placeholder="https://instagram.com/"
            />
            <Input
              label="YouTube URL *"
              value={youtubeUrl}
              onChange={setYoutubeUrl}
              placeholder="https://youtube.com/"
            />
            <Input
              label="WhatsApp Phone Number"
              value={whatsappNumber}
              onChange={setWhatsappNumber}
              placeholder="WhatsApp Number"
            />
          </div>
          <SubmitButton label="Save Social Settings" />
        </form>
      </Section>

      {/* Custom Domain Settings */}
      <Section title="Custom Domain Settings">
        <form onSubmit={handleCustomDomainSubmit}>
          <div>
            <Label>Custom Domain</Label>
            {isPremiumUser ? (
              <input
                type="text"
                value={customDomain}
                onChange={(e) => setCustomDomain(e.target.value)}
                placeholder="yourbusiness.com"
                className={inputStyle}
              />
            ) : (
              <p className="text-sm text-muted">
                For Free Users: sagai.wbook.in
              </p>
            )}
          </div>
          <SubmitButton label="Save Custom Domain Settings" />
        </form>
      </Section>
    </div>
  );
};

// Sub-components for DRY structure
const Section = ({ title, children }) => (
  <div className="bg-muted p-6 rounded-lg shadow-md mb-8">
    <h3 className="text-2xl font-semibold text-foreground mb-6">{title}</h3>
    {children}
  </div>
);

const Label = ({ children }) => (
  <label className="block text-lg font-medium mb-2 text-muted-foreground">
    {children}
  </label>
);

const Input = ({ label, value, onChange, placeholder, type = "text" }) => (
  <div>
    <Label>{label}</Label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full p-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
    />
  </div>
);

const SubmitButton = ({ label }) => (
  <div className="flex justify-end mt-6">
    <button
      type="submit"
      className="bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary"
    >
      {label}
    </button>
  </div>
);

export default Basesetting;
