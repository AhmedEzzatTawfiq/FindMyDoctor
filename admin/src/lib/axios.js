import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:4000",
});

api.interceptors.request.use((config) => {
  const aToken = localStorage.getItem("aToken");

  if (aToken) {
    config.headers.atoken = aToken;
    config.headers.Authorization = `Bearer ${aToken}`;
  }

  return config;
});
