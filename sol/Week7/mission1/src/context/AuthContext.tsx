import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";
import type { RequestSigninDto } from "../types/auth";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import { getMyInfo, postLogout, postSignin } from "../apis/auth";

interface AuthContextType {
  accessToken: string | null;
  refreshToken: string | null;
  userName: string | null;
  login: (signinData: RequestSigninDto) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  accessToken: null,
  refreshToken: null,
  userName: null,
  login: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const {
    getItem: getAccessTokenFromStorage,
    setItem: setAccessTokenInStorage,
    removeItem: removeAccessTokenFromStorage,
  } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);

  const {
    getItem: getRefreshTokenFromStorage,
    setItem: setRefreshTokenInStorage,
    removeItem: removeRefreshTokenFromStorage,
  } = useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);

  const {
    getItem: getUserNameFromStorage,
    setItem: setUserNameInStorage,
    removeItem: removeUserNameFromStorage,
  } = useLocalStorage(LOCAL_STORAGE_KEY.userName);

  const [accessToken, setAccessToken] = useState<string | null>(
    getAccessTokenFromStorage()
  );
  const [refreshToken, setRefreshToken] = useState<string | null>(
    getRefreshTokenFromStorage()
  );
  const [userName, setUserName] = useState<string | null>(
    getUserNameFromStorage()
  );

  // 구글 로그인 후 또는 새로고침 시 사용자 이름을 가져오는 효과
  useEffect(() => {
    const fetchMyInfo = async () => {
      try {
        const response = await getMyInfo();
        const fetchedName = response.data.name;

        // LocalStorage와 Context 상태 업데이트
        setUserNameInStorage(fetchedName);
        setUserName(fetchedName);
      } catch (error) {
        console.error("사용자 정보 가져오기 오류", error);
        // 오류 발생 시 토큰은 있지만 이름은 비워둠
        setUserName(null);
      }
    };

    if (accessToken) {
      // 구글 로그인 후 토큰만 저장된 상태, 혹은 새로고침 시 이 로직이 실행
      if (!userName) {
        fetchMyInfo();
      }
    } else {
      // 토큰이 없으면 이름 초기화
      setUserName(null);
    }
  }, [accessToken, setUserNameInStorage, userName]);

  const login = async (signinData: RequestSigninDto) => {
    try {
      const { data } = await postSignin(signinData);

      if (data) {
        const newAccessToken = data.accessToken;
        const newRefreshToken = data.refreshToken;
        const newUserName = data.name;

        setAccessTokenInStorage(newAccessToken);
        setRefreshTokenInStorage(newRefreshToken);
        setUserNameInStorage(newUserName);

        setAccessToken(newAccessToken);
        setRefreshToken(newRefreshToken);
        alert("로그인 성공");
        window.location.href = "/my";
      }
    } catch (error) {
      console.error("로그인 오류", error);
      alert("로그인 실패");
    }
  };

  const logout = async () => {
    try {
      await postLogout();
      removeAccessTokenFromStorage();
      removeRefreshTokenFromStorage();
      removeUserNameFromStorage();

      setAccessToken(null);
      setRefreshToken(null);
      setUserName(null);

      alert("로그아웃 성공");
    } catch (error) {
      console.error("로그아웃 오류", error);
      alert("로그아웃 실패");
    }
  };

  return (
    <AuthContext.Provider
      value={{ accessToken, refreshToken, userName, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("AuthContext를 찾을 수 없습니다");
  }
  return context;
};
