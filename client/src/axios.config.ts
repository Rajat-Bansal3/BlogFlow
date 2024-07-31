import axios from "axios";
import { backendUrl } from "./config";
const axiosInstance = axios.create({
  baseURL: backendUrl,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const authPaths = ["/api/v1/user/signin", "/api/v1/user/signup"];

    if (!authPaths.some((path) => config.url?.includes(path))) {
      const token = `Bearer ${localStorage.getItem("token")}`; 
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
