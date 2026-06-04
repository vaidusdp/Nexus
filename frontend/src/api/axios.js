import axios from "axios";

const baseEnvURL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const API = axios.create({
  baseURL: baseEnvURL.endsWith("/api/v1") ? baseEnvURL : `${baseEnvURL.replace(/\/$/, "")}/api/v1`,
  withCredentials: true,
});

export default API;
