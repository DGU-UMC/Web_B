import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Menu } from "lucide-react";

interface HeaderProps {
  setIsSidebarOpen: (isOpen: boolean) => void;
}

const Header = ({ setIsSidebarOpen }: HeaderProps) => {
  const { accessToken, userName, logout } = useAuth();

  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <nav className="bg-gray-800 fixed w-full z-10">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-white hover:bg-gray-700 rounded-lg"
            aria-label="Toggle Sidebar"
          >
            <Menu className="w-6 h-6" />
          </button>
          <Link to="/" className="text-xl font-bold text-white">
            돌려돌려 LP판
          </Link>
        </div>
        <div className="space-x-6">
          {!accessToken && (
            <>
              <Link
                to={"/login"}
                className="px-4 py-1 text-white border border-gray-700 rounded-md hover:bg-gray-800 transition duration-150 text-sm md:text-base"
              >
                로그인
              </Link>
              <Link
                to={"/signup"}
                className="px-4 py-1 bg-pink-600 text-white font-semibold rounded-md hover:bg-pink-700 transition duration-150 text-sm md:text-base"
              >
                회원가입
              </Link>
            </>
          )}
        </div>

        {accessToken && (
          <>
            <div className="flex items-center space-x-4">
              <span className="sm:inline text-gray-300 text-sm md:text-base">
                {userName}님 반갑습니다.
              </span>
              <Link
                to={"/my"}
                className="text-gray-300 hover:text-pink-500 transition duration-150 text-sm md:text-base hidden sm:inline" // 모바일에서 숨김
              >
                마이페이지
              </Link>
              <button
                onClick={handleLogout}
                className="text-gray-300 hover:text-pink-500 transition duration-150 text-sm md:text-base hidden sm:inline" // 모바일에서 숨김
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

export default Header;
