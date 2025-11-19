import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState } from "react";
import Sidebar from "../components/Sidebar";

const HomeLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isPinned, setIsPinned] = useState(true);

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
    </div>
  );
};

export default HomeLayout;
