import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { getMyInfo } from "../apis/auth";
import type { ResponseMyInfoDTO } from "../types/auth";
import userImage from "../assets/user.png";

const Mypage = () => {
  const [data, setData] = useState<ResponseMyInfoDTO>();
  useEffect(() => {
    const getData = async () => {
      const response = await getMyInfo();
      setData(response);
    };
    getData();
  }, []);
  return (
    <div className="h-dvh flex flex-col items-center bg-gray-100">
      <Outlet />
      <h1>My Page</h1>
      <div className="flex flex-col items-center pt-5">
        <img
          src={userImage}
          alt="User Profile"
          className="w-32 h-32 rounded-full mb-4"
        />
        <div className="text-lg font-semibold">{data?.data?.name}</div>
      </div>
    </div>
  );
};

export default Mypage;
