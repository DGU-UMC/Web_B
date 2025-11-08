import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import { useEffect, useRef, useState } from "react";
import FloatingButton from "../components/FloatingButton";

function ProtectedLayout() {
  const { accessToken } = useAuth();

  const [isNavbarVisible, setIsNavbarVisible] = useState(true);

  const toggleNavbar = () => {
    setIsNavbarVisible((prev) => !prev);
  };

  const navRef = useRef<HTMLElement>(null);
  // 1. Navbar DOM 요소를 참조하기 위한 ref 생성

  // 2. 외부 클릭 감지 로직
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Navbar가 보이고(isNavbarVisible),
      // navRef.current가 존재하며 (Navbar가 마운트됨),
      // 클릭된 요소(event.target)가 Navbar 내부가 아니라면
      if (
        isNavbarVisible &&
        navRef.current &&
        !navRef.current.contains(event.target as Node)
      ) {
        setIsNavbarVisible(false); // Navbar 닫기
      }
    };

    // 마우스 다운(mousedown) 이벤트에 리스너를 추가하여 클릭을 감지
    document.addEventListener("mousedown", handleClickOutside);

    // 컴포넌트 언마운트 시 또는 isNavbarVisible 변경 시 리스너 정리
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isNavbarVisible]);

  if (!accessToken) {
    alert("로그인이 필요한 서비스입니다. 로그인해주세요!");

    return <Navigate to={"/login"} replace />; // replace 덕에 history가 남지 않는다.
  }

  return (
    <div className="h-dvh flex flex-col bg-gray-50">
      <Header toggleNavbar={toggleNavbar} />
      <div className="flex flex-1">
        {/* 3. Navbar에 ref와 isVisible 상태를 props로 전달 */}
        <Navbar navRef={navRef} isVisible={isNavbarVisible} />
        <main className="relative flex-1 mt-15">
          <Outlet />
          <FloatingButton />
        </main>
      </div>
    </div>
  );
}

export default ProtectedLayout;
