import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getMyInfo } from "../apis/auth";
import { useEffect, useState } from "react";

interface HeaderProps {
  toggleNavbar: () => void;
}

const Header = ({ toggleNavbar }: HeaderProps) => {
  const navigate = useNavigate();

  const { accessToken, logout } = useAuth();

  const [myName, setMyName] = useState("");

  useEffect(() => {
    if (!accessToken) return;

    const getMyName = async () => {
      const data = await getMyInfo();
      setMyName(data.data.name);
    };

    getMyName();
  }, [accessToken]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="bg-gray-50 shadow-md fixed w-full z-50">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-2">
          <button className="w-6 cursor-pointer z-50" onClick={toggleNavbar}>
            <img src="/images/burger.svg" alt="Burger Image" />
          </button>
          <NavLink to="/" className="text-xl font-bold text-gray-900">
            돌려돌려LP판
          </NavLink>
        </div>
        <div className="space-x-6">
          {!accessToken && ( // 로그인 상태에선 로그인, 회원가입이 보이지 않는다.
            <>
              <NavLink
                to="/login"
                className="font-bold text-gray-700 hover:text-blue-500"
              >
                로그인
              </NavLink>
              <NavLink
                to="/signup"
                className="font-bold text-gray-700 hover:text-blue-500"
              >
                회원가입
              </NavLink>
            </>
          )}
          {accessToken && (
            <>
              <span className="font-medium text-gray-700">
                {myName}님 반갑습니다.
              </span>
              <button
                className="font-bold text-gray-700 hover:text-blue-500"
                onClick={handleLogout}
              >
                로그아웃
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
