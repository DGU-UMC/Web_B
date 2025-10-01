import { Outlet } from "react-router-dom";
import { Navbar } from "../components/navbar";

// src/pages/home.tsx
const HomePage = () => {
  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  );
};

export default HomePage;
