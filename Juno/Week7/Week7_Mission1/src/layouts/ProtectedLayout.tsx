import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import useToggle from "../hooks/useToggle";

function ProtectedLayout() {
  const {
    isOpen: isNavbarOpen,
    toggle: toggleNavbar,
    close: closeNavbar,
  } = useToggle();

  const { accessToken } = useAuth();

  if (!accessToken) {
    alert("로그인이 필요한 서비스입니다. 로그인해주세요!");

    return <Navigate to={"/login"} replace />; // replace 덕에 history가 남지 않는다.
  }

  return (
    <div className="min-h-screen w-full flex flex-col bg-gray-50">
      <Header toggleNavbar={toggleNavbar} />
      <div className="flex flex-1">
        <Navbar isOpen={isNavbarOpen} onClose={closeNavbar} />
        <main className="relative flex-1 mt-15">
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default ProtectedLayout;
