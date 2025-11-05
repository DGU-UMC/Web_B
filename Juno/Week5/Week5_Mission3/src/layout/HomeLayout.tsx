import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

function HomeLayout() {
  return (
    <div className="h-dvh flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}

export default HomeLayout;
