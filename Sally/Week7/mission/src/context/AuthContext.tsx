import {
  createContext,
  useContext,
  useState,
  type PropsWithChildren,
} from "react";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import { postLogout, postSignin } from "../apis/auth";
import { useLocalStorage } from "../hooks/useLocalStorage";
import type { RequestSigninDto } from "../types/auth";

interface AuthContextType {
  accessToken: string | null;
  refreshToken: string | null;
  userName: string | null;
  userId: number | null;
  login: (signInData: RequestSigninDto) => Promise<void>;
  logout: () => Promise<void>;
  updateUserInfo: (params: { name?: string | null; userId?: number | null }) => void;
}

export const AuthContext = createContext<AuthContextType>({
  accessToken: null,
  refreshToken: null,
  userName: null,
  userId: null,
  login: async () => {},
  logout: async () => {},
  updateUserInfo: () => {},
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
  const {
    getItem: getUserIdFromStorage,
    setItem: setUserIdInStorage,
    removeItem: removeUserIdFromStorage,
  } = useLocalStorage(LOCAL_STORAGE_KEY.userId);

  const [accessToken, setAccessToken] = useState<string | null>(
    getAccessTokenFromStorage()
  );
  const [refreshToken, setRefreshToken] = useState<string | null>(
    getRefreshTokenFromStorage()
  );
  const [userName, setUserName] = useState<string | null>(
    getUserNameFromStorage()
  );
  const [userId, setUserId] = useState<number | null>(
    getUserIdFromStorage()
  );

  const login = async (signInData: RequestSigninDto) => {
    try {
      const { data } = await postSignin(signInData);

      if (data) {
        setAccessTokenInStorage(data.accessToken);
        setRefreshTokenInStorage(data.refreshToken);
        setUserNameInStorage(data.name);
        setUserIdInStorage(data.id);
        setAccessToken(data.accessToken);
        setRefreshToken(data.refreshToken);
        setUserName(data.name);
        setUserId(data.id);
        alert("로그인에 성공했습니다.");
        window.location.replace("/mypage");
      }
    } catch (error) {
      console.error("로그인 오류", error);
      alert("로그인에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const logout = async () => {
    try {
      await postLogout();
      removeAccessTokenFromStorage();
      removeRefreshTokenFromStorage();
      removeUserNameFromStorage();
      removeUserIdFromStorage();
      setAccessToken(null);
      setRefreshToken(null);
      setUserName(null);
      setUserId(null);
      alert("로그아웃 되었습니다.");
    } catch (error) {
      console.error("로그아웃 오류", error);
      alert("로그아웃에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const updateUserInfo = ({
    name,
    userId: nextUserId,
  }: {
    name?: string | null;
    userId?: number | null;
  }) => {
    if (name !== undefined) {
      if (name) {
        setUserNameInStorage(name);
        setUserName(name);
      } else {
        removeUserNameFromStorage();
        setUserName(null);
      }
    }

    if (nextUserId !== undefined) {
      if (nextUserId !== null) {
        setUserIdInStorage(nextUserId);
        setUserId(nextUserId);
      } else {
        removeUserIdFromStorage();
        setUserId(null);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        refreshToken,
        userName,
        userId,
        login,
        logout,
        updateUserInfo,
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
