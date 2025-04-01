
const checkDomain = (req, res, next) => {
    console.log("dffd:dfdf");
    const host = req.hostname; // Get hostname from request
    const subdomain = host.split(".")[0]; // Extract subdomain (assuming "subdomain.domain.com")

    console.log("Subdomain:", subdomain);

    // You can conditionally handle different subdomains
    if (subdomain === "admin") {
        console.log("Admin panel accessed");
    } else {
        console.log("User dashboard accessed");
    }

    next(); // Continue processing the request
  };
  
  export default checkDomain;