// src/components/Sidebar.tsx

import { Search, User } from "lucide-react";
import { Link } from "react-router-dom";

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
        </div>
      </nav>

      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-30 lg:hidden"
        />
      )}
    </>
  );
};

export default Sidebar;
