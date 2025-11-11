import { useEffect, useState } from "react";
import { type ResponseMyInfoDto } from "../types/auth";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../apis/axios";

const MyPage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<ResponseMyInfoDto | null>(null);

  useEffect(() => {
    const fetchMyInfo = async () => {
      const rawToken = localStorage.getItem(LOCAL_STORAGE_KEY.accessToken);
      const token = rawToken?.replace(/^"|"$/g, "");
      const url = import.meta.env.VITE_SERVER_API_URL + "/v1/users/me" ;

      try {
        const res = await axiosInstance.get<ResponseMyInfoDto>(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            accept: "application/json",
          },
        });
        setData(res.data);
      } catch (error) {
        console.error("인증 실패 또는 요청 오류:", error);
      }
    };

    fetchMyInfo();
  }, []);

  if (!data) return null;

  const me = data.data;

  const handleLogout = async() => {
    await logout();
    navigate('/');
  };

  return (
    <div className="p-6 min-h-screen bg-pink-200">
      <h1 className="text-xl font-bold">마이페이지</h1>
      <p className="mt-2">이름: {me.name}</p>
      <p>이메일: {me.email}</p>
      {me.bio && <p>소개: {me.bio}</p>}

      <button 
        className='cursor-pointer bg-indigo-300 rounded-sm p-2 hover:scale-97'
        onClick={handleLogout}>
        로그아웃
      </button>
    </div>
  );
};

export default MyPage;
