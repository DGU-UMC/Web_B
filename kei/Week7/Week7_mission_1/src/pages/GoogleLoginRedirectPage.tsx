import { useEffect } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { LOCAL_STORAGE_KEY } from "../constants/key";

function stripQuotes(v: string | null) {
  return typeof v === "string" ? v.replace(/^"|"$/g, "") : v;
}

const GoogleLoginRedirectPage = () => {
  const { setItem: setAccessToken } = useLocalStorage(
    LOCAL_STORAGE_KEY.accessToken
  );
  const { setItem: setRefreshToken } = useLocalStorage(
    LOCAL_STORAGE_KEY.refreshToken
  );

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);

    // 서버가 쿼리로 내려준 값들
    const rawAccess = urlParams.get(LOCAL_STORAGE_KEY.accessToken);
    const rawRefresh = urlParams.get(LOCAL_STORAGE_KEY.refreshToken);
    const redirect = urlParams.get("redirect") || "/";

    const accessToken = stripQuotes(rawAccess);
    const refreshToken = stripQuotes(rawRefresh);

    if (accessToken) {
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);

      // URL에 노출된 쿼리 정리(히스토리 교체)
      window.history.replaceState(null, "", "/v1/auth/google/callback");

      // 원래 가려던 곳(없으면 홈)으로 복귀
      window.location.replace(redirect);
    }
  }, [setAccessToken, setRefreshToken]);

  return <div>구글 로그인 화면</div>;
};

export default GoogleLoginRedirectPage;