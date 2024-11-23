// src/config/api.js
export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL,
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
