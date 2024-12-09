// src/config/api.js

// Helper function to clean URL string
const cleanUrl = (url) => {
  if (!url) return ""
  // Remove quotes and trailing slashes
  return url.replace(/['"]+/g, "").replace(/\/+$/, "")
}

export const API_CONFIG = {
  baseURL: cleanUrl(import.meta.env.VITE_API_URL),
  isProduction: import.meta.env.VITE_API_URL.includes("amazonaws"),
  environment: import.meta.env.VITE_API_URL.includes("localhost")
    ? "local"
    : "production",
}

export const getApiConfig = () => {
  console.log(`Running in ${API_CONFIG.environment} mode`)
  console.log(`API URL: ${API_CONFIG.baseURL}`)
  return API_CONFIG
}

export default API_CONFIG
