import { Outlet } from "react-router";
import NavBar from "../components/Navbar";

const HomePage = () => {
  return (
    <div>
      <NavBar />
      <Outlet />
    </div>
  );
};

export default HomePage;
