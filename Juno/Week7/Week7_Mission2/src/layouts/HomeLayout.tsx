import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Header from "../components/Header";
import FloatingLpModalButton from "../components/FloatingLpModalButton";
import useToggle from "../hooks/useToggle";
import LpModal from "../components/LpModal";

const HomeLayout = () => {
  const {
    isOpen: isNavbarOpen,
    toggle: toggleNavbar,
    close: closeNavbar,
  } = useToggle();

  const {
    isOpen: isLpModalOpen,
    toggle: toggleLpModal,
    close: closeLpModal,
  } = useToggle();

  return (
    <div className="min-h-screen w-full flex flex-col bg-gray-50">
      <Header toggleNavbar={toggleNavbar} />
      <div className="flex flex-1">
        <Navbar isOpen={isNavbarOpen} onClose={closeNavbar} />
        <main className="relative flex-1 mt-15">
          <div className="p-6">
            <Outlet />
          </div>
          <FloatingLpModalButton toggleLpModal={toggleLpModal} />
          <LpModal
            isOpen={isLpModalOpen}
            onClose={closeLpModal}
            toggle={toggleLpModal}
          />
        </main>
      </div>
    </div>
  );
};

export default HomeLayout;
