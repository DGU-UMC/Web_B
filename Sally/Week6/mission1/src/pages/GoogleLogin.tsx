import { useEffect } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { LOCAL_STORAGE_KEY } from "../constants/key";

const GoogleLogin = () => {
  const { setItem: setAccessToken } = useLocalStorage(
    LOCAL_STORAGE_KEY.accessToken
  );
  const { setItem: setRefreshToken } = useLocalStorage(
    LOCAL_STORAGE_KEY.refreshToken
  );
  const { setItem: setUserName } = useLocalStorage(LOCAL_STORAGE_KEY.userName);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get("accessToken");
    const refreshToken = urlParams.get("refreshToken");
    const name = urlParams.get("name");

    if (accessToken && refreshToken && name) {
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);
      setUserName(name);
      window.location.href = "/mypage";
    }
  }, [setAccessToken, setRefreshToken, setUserName]);

  return <div>구글 로그인</div>;
};

export default GoogleLogin;
