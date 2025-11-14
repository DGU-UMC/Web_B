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

function hadAuthHeader(cfg?: AxiosRequestConfig) {
  const h = (cfg?.headers ?? {});
  // axios가 소문자로 정규화하는 경우 대비
  return Boolean(h.Authorization || h.authorization);
}

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

  // 401이 아니거나, 인증 엔드포인트면 건드리지 않음
  if (status !== 401 || isAuthPath) {
    return Promise.reject(error);
  }

  // refresh 루프 방지
  if (originalRequest._retry) {
    // 이미 토큰 재발급을 시도한 요청이라면 여기서 중단한다.
    // 권한 부족 등으로 인한 401까지 모두 로그아웃으로 연결되는 것을 막기 위함.
    return Promise.reject(error);
  }
  originalRequest._retry = true;

  const rawRt = localStorage.getItem(LOCAL_STORAGE_KEY.refreshToken);
  const refreshToken = rawRt?.replace(/^"|"$/g, "");

  // refreshToken이 없으면:
  // - 원 요청에 Authorization 있었으면 사용자는 로그인한 상태였다고 간주 → 정리 + 리다이렉트
  // - 없었으면(게스트 요청) → 리다이렉트 하지 말고 그냥 reject (모달이 처리)
  if (!refreshToken) {
    clearTokensAndMaybeRedirect(hadAuthHeader(originalRequest));
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
      { refreshToken },
      { withCredentials: true },
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
    clearTokensAndMaybeRedirect(true);
    return Promise.reject(e);
   } finally {
    isRefreshing = false;
  }
}
);

function clearTokensAndMaybeRedirect(shouldRedirect: boolean) {
  localStorage.removeItem(LOCAL_STORAGE_KEY.accessToken);
  localStorage.removeItem(LOCAL_STORAGE_KEY.refreshToken);
  if (shouldRedirect && window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
}
