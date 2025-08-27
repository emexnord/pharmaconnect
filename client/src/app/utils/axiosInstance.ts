import axios from "axios";
import { signOut } from "next-auth/react";

// Axios Interceptor Instance
export const AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json", // Set default headers for all requests
  },
});

AxiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle token expiration
      handleTokenExpiration();
    }
    return Promise.reject(error);
  }
);

let isExpirationHandled = false;

const handleTokenExpiration = () => {
  console.log("Token expired, signing out...");
  if (isExpirationHandled) return;
  isExpirationHandled = true;
  signOut({ callbackUrl: "/?signin=session-expired" });

  // Add session-expired hash to the url
  // window.location.hash = "session-expired";
};
