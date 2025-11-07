import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { globalCONFIG } from "../../global-config";

const axiosInstance = axios.create({
  baseURL: globalCONFIG.serverURL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = AsyncStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      AsyncStorage.removeItem("token");
      AsyncStorage.removeItem("userData");
      console.warn('Sessão expirada - token removido');
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;

export const endpoints = {
  posts: "/posts",
  user: "/user",
  teacher: "/teacher",
};
