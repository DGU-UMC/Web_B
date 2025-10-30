import axios from "axios";
import { LOCAL_STORAGE_KEY } from "../constants/key";

const accessToken = localStorage
  .getItem(LOCAL_STORAGE_KEY.accessToken)
  ?.replace(/^"|"$/g, "");

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_API_URL,
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
});
