import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { getMyInfo } from "../apis/auth";
import type { ResponseMyInfoDTO } from "../types/auth";

const Mypage = () => {
  const [data, setData] = useState<ResponseMyInfoDTO>([]);
  useEffect(() => {
    const getData = async () => {
      const response = await getMyInfo();
      setData(response);
    };
    getData();
  }, []);
  return (
    <div className="h-dvh flex flex-col">
      <Outlet />
      <div>{data?.data?.name}</div>
    </div>
  );
};

export default Mypage;
