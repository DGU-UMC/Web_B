import axios, {
  AxiosError,
  AxiosHeaders,
  type InternalAxiosRequestConfig,
  type AxiosRequestConfig,
} from "axios";
import { LOCAL_STORAGE_KEY } from "../constants/key";

const BASE_URL = import.meta.env.VITE_SERVER_API_URL as string;

export const axiosInstance = axios.create({
baseURL: BASE_URL,
withCredentials: true,
});

axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
if (!(config.headers instanceof AxiosHeaders)) {
  config.headers = new AxiosHeaders(config.headers);
}
const raw = localStorage.getItem(LOCAL_STORAGE_KEY.accessToken);
const token = raw?.replace(/^"|"$/g, "");
const h = config.headers as AxiosHeaders;

if (token) h.set("Authorization", `Bearer ${token}`);
else h.delete("Authorization");

return config;
});

let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

function subscribeTokenRefresh(cb: (token: string) => void) {
refreshSubscribers.push(cb);
}
function onRefreshed(token: string) {
refreshSubscribers.forEach((cb) => cb(token));
refreshSubscribers = [];
}

const refreshClient = axios.create({
baseURL: BASE_URL,
withCredentials: true,
});

axiosInstance.interceptors.response.use(
(res) => res, // API 응답이 성공일 때
async (error: AxiosError) => { // API 응답이 실패일 때
  const originalRequest = error.config as (AxiosRequestConfig & { _retry?: boolean }) | undefined;
  const status = error.response?.status; //status : 401

  if (!originalRequest) {
    return Promise.reject(error);
  }

  const url = (originalRequest.url || "").toLowerCase();
  const isAuthPath =
    url.includes("/v1/auth/signin") ||
    url.includes("/v1/auth/signout") ||
    url.includes("/v1/auth/refresh");

  if (status !== 401 || isAuthPath) {
    return Promise.reject(error);
  }

  if (originalRequest._retry) {
    return Promise.reject(error);
  }
  originalRequest._retry = true;

  const rawRt = localStorage.getItem(LOCAL_STORAGE_KEY.refreshToken);
  const refreshToken = rawRt?.replace(/^"|"$/g, "");

  if (!refreshToken) {
    clearTokensAndRedirect();
    return Promise.reject(error);
  }

  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      subscribeTokenRefresh((newAccess) => {
        try {
          if (!originalRequest.headers) originalRequest.headers = {};
          (originalRequest.headers).Authorization = `Bearer ${newAccess}`;
          resolve(axiosInstance(originalRequest));
        } catch (e) {
          reject(e);
        }
      });
    });
  }

  isRefreshing = true;

  try {
    const { data } = await refreshClient.post<{ accessToken: string; refreshToken?: string }>(
      "/v1/auth/refresh",
      { refreshToken }
    );

    const newAccess = data?.accessToken;
    const newRefresh = data?.refreshToken;

    if (!newAccess) throw new Error("No accessToken in refresh response");

    localStorage.setItem(LOCAL_STORAGE_KEY.accessToken, JSON.stringify(newAccess));
    if (newRefresh) {
      localStorage.setItem(LOCAL_STORAGE_KEY.refreshToken, JSON.stringify(newRefresh));
    }

    onRefreshed(newAccess);
    if (!originalRequest.headers) originalRequest.headers = {};
    (originalRequest.headers).Authorization = `Bearer ${newAccess}`;

    return axiosInstance(originalRequest);
  } catch (e) {
    clearTokensAndRedirect();
    return Promise.reject(e);
   } finally {
    isRefreshing = false;
  }
}
);

function clearTokensAndRedirect() {
localStorage.removeItem(LOCAL_STORAGE_KEY.accessToken);
localStorage.removeItem(LOCAL_STORAGE_KEY.refreshToken);
if (window.location.pathname !== "/login") {
  window.location.href = "/login";
}
}
