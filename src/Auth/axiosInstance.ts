import axios from "axios";
import { getToken, removeToken } from "./auth";

const api = axios.create({
  baseURL: "https://design-shark-backend-4-6.onrender.com/api",
});

// Automatically attach token to requests
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration or invalid token
api.interceptors.response.use(
  (response) => response, // If response is OK, just return it
  async (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // console.error("Invalid or expired token. Logging out...");
      removeToken(); // Clear the token
      window.location.href = "/login"; // Redirect user to login page
    }
    return Promise.reject(error);
  }
);

export default api;
