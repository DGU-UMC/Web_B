import { useEffect } from "react";
import { NavLink } from "react-router-dom";

interface NavbarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Navbar = ({ isOpen, onClose }: NavbarProps) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    // 사이드바가 열려있을 때 메인 화면 스크롤 불가
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 z-30 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      ></div>
      <nav
        className={`fixed top-0 left-0 h-full w-60 bg-gray-50 flex flex-col box-border p-4 shadow-2xl transform transition-transform ease-in-out duration-300 z-40 ${
          isOpen
            ? "opacity-100 translate-x-0"
            : "opacity-0 pointer-events-none -translate-x-full"
        }`}
        role="dialog"
      >
        <div className="flex-1 flex flex-col space-y-2 mt-15">
          <NavLink
            to="/my"
            className="font-bold text-gray-700 hover:text-blue-500"
          >
            마이페이지
          </NavLink>
          <NavLink
            to="/search"
            className="font-bold text-gray-700 hover:text-blue-500"
          >
            검색
          </NavLink>
        </div>
        <div className="text-gray-600">
          <p>
            &copy; {new Date().getFullYear()}. 돌려돌려LP판.
            {/* HTML 엔티티: HTML 문법에서 특별한 의미를 지니고 있는 문자를 화면에 표시하고 싶을 때 사용한다. &copy;, &lt;, &gt; 등이 있다. */}
          </p>
          <p>All rights reserved.</p>
          <div className="flex flex-col justify-center space-y-2 mt-4">
            <NavLink to="#">Privacy Policy</NavLink>
            <NavLink to="#">Terms of Service</NavLink>
            <NavLink to="#">Contact</NavLink>
            {/* #: 눌러도 이동이 안 된다. */}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
