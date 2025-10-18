import axios from "axios";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://web-production-310c7c7.up.railway.app";
export const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "X-API-Key": API_KEY,
  },
  timeout: 10000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error(
        `API error: ${error.response.status} - ${error.response.data.detail || "No detail"}`
      );
    } else if (error.request) {
      console.error("API unreachable or CORS blocked");
    } else {
      console.error("Error setting up request:", error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
