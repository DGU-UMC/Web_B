import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import LpCreateModal from "../components/LpCreateModal";
import { useAuth } from "../context/AuthContext";

const HomeLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isPinned, setIsPinned] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { accessToken } = useAuth();

  const handleMenuToggle = () => {
    const isDesktop = window.innerWidth >= 1024;

    if (!isDesktop) {
      setIsSidebarOpen(!isSidebarOpen);
    } else {
      setIsPinned(!isPinned);
    }
  };

  return (
    <div className="h-dvh flex flex-col">
      <Header setIsSidebarOpen={handleMenuToggle} />

      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        isPinned={isPinned}
        setIsPinned={setIsPinned}
      />

      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />

      {accessToken && (
        <button
          type="button"
          className="fixed bottom-6 right-6 bg-pink-600 text-white rounded-full w-14 h-14 text-3xl shadow-lg hover:bg-pink-700"
          onClick={() => setIsCreateModalOpen(true)}
        >
          +
        </button>
      )}

      {isCreateModalOpen && (
        <LpCreateModal onClose={() => setIsCreateModalOpen(false)} />
      )}
    </div>
  );
};

export default HomeLayout;
