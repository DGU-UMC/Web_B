import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Header from "../components/Header";
import FloatingButton from "../components/FloatingButton";
import useNavbar from "../hooks/useNavbar";

const HomeLayout = () => {
  const { isOpen, toggle, close } = useNavbar();

  return (
    <div className="h-dvh w-full flex flex-col bg-gray-50">
      <Header toggleNavbar={toggle} />
      <div className="flex flex-1">
        <Navbar isOpen={isOpen} onClose={close} />
        <main className="relative flex-1 mt-15">
          <Outlet />
          <FloatingButton />
        </main>
      </div>
    </div>
  );
};

export default HomeLayout;
