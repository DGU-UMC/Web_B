import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import useGetMyInfo from "../hooks/queries/useGetMyInfo";
import { useState } from "react";
import usePatchMyInfo from "../hooks/mutations/usePatchMyInfo";

function MyPage() {
  // 로그아웃 로직
  const navigate = useNavigate();
  const { logout } = useAuth();
  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  // 내 정보 가져오기
  const { accessToken } = useAuth();
  const { data } = useGetMyInfo(accessToken);

  // 내 정보 수정
  const [isPatching, setIsPatching] = useState(false);
  const [patchedName, setPatchedName] = useState("");
  const [patchedBio, setPatchedBio] = useState("");
  const { mutate } = usePatchMyInfo();

  return (
    <div className="mt-5 ml-5 flex flex-1 space-x-4">
      <div className="w-30 h-30 bg-gray-500 rounded-full"></div>
      <div className="flex flex-col justify-center space-y-2">
        <h1 className={`font-bold text-lg ${isPatching ? "hidden" : ""}`}>
          {data?.data.name}
        </h1>
        <input
          type="text"
          name="content"
          value={patchedName}
          onChange={(e) => setPatchedName(e.target.value)}
          className={`flex-1 px-2 border rounded-lg ${
            isPatching ? "" : "hidden"
          }`}
        />
        <p className={`${isPatching ? "hidden" : ""}`}>{`${
          data?.data.bio === null
            ? "상태메시지를 입력해주세요."
            : data?.data.bio
        }`}</p>
        <input
          type="text"
          name="content"
          value={patchedBio}
          onChange={(e) => setPatchedBio(e.target.value)}
          className={`flex-1 px-2 border rounded-lg ${
            isPatching ? "" : "hidden"
          }`}
        />
        <div className="flex space-x-4">
          <button
            onClick={() => setIsPatching(true)}
            className={`cursor-pointer w-24 box-border px-4 py-2 bg-gray-950 text-gray-50 rounded-xl ${
              isPatching ? "hidden" : ""
            }`}
          >
            수정
          </button>
          <button
            onClick={() => {
              mutate({
                name: patchedName,
                bio: patchedBio,
                avatar: "",
              });
              setIsPatching(false);
            }}
            disabled={patchedName?.length === 0}
            className={`cursor-pointer w-24 px-4 py-2 bg-gray-950 text-gray-50 rounded-xl disabled:bg-gray-400 disabled:cursor-not-allowed ${
              isPatching ? "" : "hidden"
            }`}
          >
            완료
          </button>
          <button
            className="cursor-pointer w-24 box-border px-4 py-2 bg-gray-950 text-gray-50 rounded-xl"
            onClick={() => handleLogout()}
          >
            로그아웃
          </button>
        </div>
      </div>
    </div>
  );
}

export default MyPage;
