import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import FloatingModalButton from "../components/FloatingLpModalButton";
import useToggle from "../hooks/useToggle";

function ProtectedLayout() {
  const { isOpen, toggle, close } = useToggle();

  const { accessToken } = useAuth();

  if (!accessToken) {
    alert("로그인이 필요한 서비스입니다. 로그인해주세요!");

    return <Navigate to={"/login"} replace />; // replace 덕에 history가 남지 않는다.
  }

  return (
    <div className="min-h-screen w-full flex flex-col bg-gray-50">
      <Header toggleNavbar={toggle} />
      <div className="flex flex-1">
        <Navbar isOpen={isOpen} onClose={close} />
        <main className="relative flex-1 mt-15">
          <Outlet />
          <FloatingModalButton />
        </main>
      </div>
    </div>
  );
}

export default ProtectedLayout;
