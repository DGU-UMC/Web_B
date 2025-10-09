import { Outlet } from "react-router-dom";

const Mypage = () => {
  return (
    <div className="h-dvh flex flex-col">
      <Outlet />
    </div>
  );
};

export default Mypage;
