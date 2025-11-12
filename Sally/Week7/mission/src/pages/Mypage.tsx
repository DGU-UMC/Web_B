import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { getMyInfo } from "../apis/auth";
import type { ResponseMyInfoDTO } from "../types/auth";
import { useAuth } from "../context/AuthContext";

const Mypage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<ResponseMyInfoDTO>();
  useEffect(() => {
    const getData = async () => {
      const response = await getMyInfo();
      setData(response);
    };
    getData();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };
  return (
    <div className="h-dvh flex flex-col items-center bg-gray-100">
      <Outlet />
      <div className="flex flex-col items-center pt-5">
        <div className="text-lg font-semibold">
          {data?.data?.name}님 환영합니다
        </div>
        <img src={(data?.data?.avatar as string) || ""} alt="프로필 사진" />
        {data && <h1>{data.data?.email}</h1>}
      </div>

      <button
        className="cursor-pointer bg-blue-300 p-5 rounded-sm hover:scale-90"
        onClick={handleLogout}
      >
        로그아웃
      </button>
    </div>
  );
};

export default Mypage;
