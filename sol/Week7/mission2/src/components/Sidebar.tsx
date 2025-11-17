// src/components/Sidebar.tsx

import { Search, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import useDeleteAccount from "../hooks/mutations/useDeleteAccount";

interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  isPinned: boolean;
  setIsPinned: (isPinned: boolean) => void;
}

const Sidebar = ({
  isSidebarOpen,
  setIsSidebarOpen,
  isPinned,
  setIsPinned,
}: SidebarProps) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { mutateAsync: deleteAccount, isPending } = useDeleteAccount();

  const menuItems = [
    { name: "찾기", icon: Search, path: "/" },
    { name: "마이페이지", icon: User, path: "/my" },
  ];

  const mobileTransformClass = isSidebarOpen
    ? "translate-x-0"
    : "-translate-x-full";
  const desktopTransformClass = isPinned
    ? "lg:translate-x-0"
    : "lg:-translate-x-full";

  return (
    <>
      <nav
        className={`fixed top-16 left-0 w-64 h-[calc(100vh-4rem)] bg-gray-900 text-white z-40 transition-all duration-300 ease-in-out border-r border-gray-800
          ${mobileTransformClass} ${desktopTransformClass} 
           `}
      >
        <div className="p-4 space-y-6 overflow-y-auto h-full">
          <div>
            <ul className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.name}>
                    <Link
                      to={item.path}
                      onClick={() => {
                        const isDesktop = window.innerWidth >= 1024;
                        if (!isDesktop) {
                          setIsSidebarOpen(false);
                        } else {
                          setIsPinned(false);
                        }
                      }}
                      className={`flex items-center p-3 rounded-lg transition-colors duration-150 hover:bg-gray-800`}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0 mr-3" />
                      <span className="text-base font-medium">{item.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="pt-4 border-t border-gray-800">
            <button
              className="w-full text-left text-sm text-red-400 hover:text-red-300"
              onClick={() => setIsDeleteModalOpen(true)}
            >
              탈퇴하기
            </button>
          </div>
        </div>
      </nav>

      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-30 lg:hidden"
        />
      )}

      {isDeleteModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setIsDeleteModalOpen(false)}
        >
          <div
            className="bg-white text-black rounded-lg p-6 w-80"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-3">정말 탈퇴하시겠어요?</h3>
            <p className="text-sm text-gray-600 mb-4">
              확인을 누르면 계정이 삭제되고 되돌릴 수 없습니다.
            </p>
            <div className="flex justify-end gap-2">
              <button
                className="px-3 py-2 rounded-md bg-gray-200"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                취소
              </button>
              <button
                className="px-3 py-2 rounded-md bg-red-500 text-white disabled:bg-red-200"
                disabled={isPending}
                onClick={async () => {
                  await deleteAccount();
                  await logout();
                  navigate("/");
                }}
              >
                {isPending ? "삭제 중..." : "확인"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
