import axios from "axios";
import { LOCAL_STORAGE_KEY } from "../constants/key";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_API_URL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY.accessToken);
    const token = raw?.replace(/^"|"$/g, "");
    (config.headers) = (config.headers || {});

    if (token) {
        (config.headers).Authorization = `Bearer ${token}`;
    } else {
        delete (config.headers).Authorization;
    }
    return config;
});
  