import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";
import { useMutation } from "@tanstack/react-query";
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
  loginError?: string | null;
  isLoggingIn?: boolean;
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
  const [loginError, setLoginError] = useState<string | null>(null);

  // 구글 로그인 후 새로고침 시 사용자 이름이 비어있는 경우 보정
  useEffect(() => {
    const fetchMyInfo = async () => {
      try {
        const response = await getMyInfo();
        const fetchedName = response.data.name;

        // LocalStorage와 Context 상태 업데이트
        setUserNameInStorage(fetchedName);
        setUserName(fetchedName);
      } catch (error) {
        console.error("사용자 정보를 가져오지 못했습니다", error);
        // 오류 발생 시 토큰은 살려두고 이름만 비움
        setUserName(null);
      }
    };

    if (accessToken) {
      // 기존 로그인 토큰이 저장된 상태, 단발성 새로고침 보정 로직 수행
      if (!userName) {
        fetchMyInfo();
      }
    } else {
      // 토큰 없으면 이름 초기화
      setUserName(null);
    }
  }, [accessToken, setUserNameInStorage, userName]);

  const loginMutation = useMutation({
    mutationFn: (signinData: RequestSigninDto) => postSignin(signinData),
    onSuccess: ({ data }) => {
      setLoginError(null);
      const newAccessToken = data.accessToken;
      const newRefreshToken = data.refreshToken;
      const newUserName = data.name;

      setAccessTokenInStorage(newAccessToken);
      setRefreshTokenInStorage(newRefreshToken);
      setUserNameInStorage(newUserName);

      setAccessToken(newAccessToken);
      setRefreshToken(newRefreshToken);
      setUserName(newUserName);
      alert("로그인 성공");
      window.location.href = "/";
    },
    onError: () => {
      setLoginError("로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.");
      alert("로그인 실패");
    },
  });

  const login = async (signinData: RequestSigninDto) => {
    await loginMutation.mutateAsync(signinData);
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
      value={{
        accessToken,
        refreshToken,
        userName,
        login,
        logout,
        loginError,
        isLoggingIn: loginMutation.isPending,
      }}
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
