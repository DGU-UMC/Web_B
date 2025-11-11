import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getMyInfo } from "../apis/auth";
import type { ResponseMyInfoDTO } from "../types/auth";

const Navbar = () => {
  const { accessToken, logout } = useAuth();
  const [userName, setUserName] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (accessToken) {
        try {
          const response = await getMyInfo();
          setUserName(response?.data?.name || null);
        } catch (error) {
          console.error("사용자 정보 가져오기 실패:", error);
        }
      }
    };
    fetchUserInfo();
  }, [accessToken]);

  const handleLogout = async () => {
    await logout();
    setUserName(null);
    navigate("/");
  };

  return (
    <nav className="bg-gray-800 fixed w-full z-10">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <Link to="/" className="text-xl font-bold text-white">
            돌려돌려 LP판
          </Link>
        </div>
        <div className="space-x-6">
          {!accessToken && (
            <>
              <Link
                to={"/login"}
                className="text-gray-300 darjk:text-gray-300 hover:text-pink-500 "
              >
                로그인
              </Link>
              <Link
                to={"/signup"}
                className="text-gray-300 darjk:text-gray-300 hover:text-pink-500 "
              >
                회원가입
              </Link>
            </>
          )}
        </div>

        {accessToken && (
          <>
            <div className="flex items-center space-x-4">
              {userName && (
                <span className="sm:inline text-gray-300 text-sm md:text-base">
                  {userName}님 반갑습니다.
                </span>
              )}
              <Link
                to={"/mypage"}
                className="text-gray-300 darjk:text-gray-300 hover:text-pink-500 " // 모바일에서 숨김
              >
                마이페이지
              </Link>
              <button
                onClick={handleLogout}
                className="text-gray-300 darjk:text-gray-300 hover:text-pink-500 " // 모바일에서 숨김
              >
                로그아웃
              </button>
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
