import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// TEMP token (jab tak login backend ready nahi)
API.interceptors.request.use((config) => {
  config.headers.Authorization = "Bearer testtoken";
  return config;
});

export default API;
