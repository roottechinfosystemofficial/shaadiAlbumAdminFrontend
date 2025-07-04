// utils/responseUtil.js

/**
 * Sends a standardized JSON response.
 * @param {object} res - The Express response object.
 * @param {number} statusCode - The HTTP status code.
 * @param {object} data - The data to send in the response.
 * @param {string} message - The message to include in the response.
 */
const sendResponse = (res, statusCode, data = null, message = "") => {
  const response = {
    success: statusCode >= 200 && statusCode < 300,
    message,
    data,
  };

  res.status(statusCode).json(response);
};

export default sendResponse;



export function bytesToGB(bytes, decimals = 2) {
  if (bytes === 0) return "0 GB";
  const gb = bytes / (1024 ** 3); // or 1073741824
  return `${gb.toFixed(decimals)} GB`;
}


// src/utils/getSubdomain.js
export const getSubdomain = () => {
  const host = window.location.hostname; // e.g., abc.shaadialbum.in
  const parts = host.split(".");
  if (host.includes("localhost")) return null; // skip on localhost
  if (parts.length > 2) return parts[0]; // "abc"
  return null;
};

