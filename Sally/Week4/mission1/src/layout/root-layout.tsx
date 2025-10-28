// src/layout/root-layout.tsx
import { Outlet } from "react-router-dom";
import { Navbar } from "../components/NavBar";

const RootLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

export default RootLayout;
