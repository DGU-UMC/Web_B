import { Outlet } from "react-router-dom";

const Home = () => {
  return (
    <div className="h-dvh flex flex-col">
      <Outlet />
    </div>
  );
};

export default Home;
