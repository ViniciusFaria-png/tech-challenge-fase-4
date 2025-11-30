import axios from "axios";
import { getToken, removeToken } from "./secure-store";

const SERVER_URL = process.env.EXPO_PUBLIC_SERVER_URL || "https://blog-dinamico-app.onrender.com";

const axiosInstance = axios.create({
  baseURL: SERVER_URL,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await removeToken();
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

export const endpoints = {
  posts: "/posts",
  user: "/user",
  teacher: "/teacher",
};


