import { Outlet } from "react-router-dom";

const HomeLayout = () => {
  return (
    <div className="h-dvh flex flex-col">
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default HomeLayout;
