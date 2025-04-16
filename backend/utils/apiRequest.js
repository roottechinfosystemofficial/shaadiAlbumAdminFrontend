import axios from "axios";

const apiClient = axios.create({
  withCredentials: true,
});

/**
 * Utility function to make API requests.
 * @param {string} method - HTTP method (GET, POST, PUT, DELETE).
 * @param {string} endpoint - The API endpoint.
 * @param {object} data - The request body (for POST and PUT).
 * @param {string} token - The authorization token (optional).
 * @returns {Promise<Object>} - The response data from the API.
 */
const apiRequest = async (method, endpoint, data = {}, token = "") => {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  try {
    const response = await apiClient({
      method,
      url: endpoint,
      data,
      headers,
    });
    return response;
  } catch (error) {
    console.error("API request error:", error);
    throw error;
  } finally {
  }
};

export default apiRequest;
