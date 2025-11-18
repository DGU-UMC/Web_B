import { useEffect, useState } from "react";
import { type ResponseMyInfoDto, type UpdateUserDto } from "../types/auth";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../apis/axios";
import { useMutation } from "@tanstack/react-query";
import { patchMyInfo } from "../apis/users";

const DEFAULT_AVATAR = '/public/images/defaultProfile.png';

const MyPage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<ResponseMyInfoDto | null>(null);
  const [open, setOpen] = useState(false);

  // 폼 상태
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('');

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

        // 폼 초기값 세팅
        const me = res.data.data;
        setName(me.name ?? '');
        setBio(me.bio ?? '');
        setAvatar(me.avatar ?? '');
      } catch (error) {
        console.error("인증 실패 또는 요청 오류:", error);
      }
    };

    fetchMyInfo();
  }, []);

  const me = data?.data;
  const avatarSrc = me?.avatar || DEFAULT_AVATAR;

  const { mutate: updateMe, isPending } = useMutation({
    mutationFn: (payload: UpdateUserDto) => patchMyInfo(payload),
    onSuccess: (updated) => {
      setData((prev) => 
        prev ? { ...prev, data: {...prev.data, ...updated }} : ({ data: updated } as ResponseMyInfoDto)
      );
      setOpen(false);
    },
    onError: (err) => {
      console.error('유저 정보 수정 실패 : ', err);
    },
  });

  const handleLogout = async() => {
    await logout();
    navigate('/');
  };

  const openSettings = () => {
    if (!me) return;
    setName(me.name ?? "");
    setBio(me.bio ?? "");
    setAvatar(me.avatar ?? "");
    setOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) return;

    const payload: UpdateUserDto = {
      name: trimmedName,
      bio: bio.trim() ? bio.trim() : null,
      avatar: avatar.trim() ? avatar.trim() : DEFAULT_AVATAR,
    };

    updateMe(payload);
  };

  if (!data) return null;

  return (
    <div className="p-6 min-h-screen bg-pink-200">
      <div className="flex items-center gap-4">
        <img
          src={avatarSrc}
          alt="프로필"
          className="h-20 w-20 rounded-full object-cover border border-black/10 bg-white"
        />
        <div>
          <h1 className="text-xl font-bold">마이페이지</h1>
          <p className="mt-1">이름: {me?.name}</p>
          <p>이메일: {me?.email}</p>
          {me?.bio && <p className="text-sm text-black/70 mt-1">소개: {me.bio}</p>}
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <button
          className="cursor-pointer bg-neutral-800 text-white rounded-md px-4 py-2 hover:bg-neutral-700"
          onClick={openSettings}
        >
          설정
        </button>
        <button
          className="cursor-pointer bg-indigo-300 rounded-md px-4 py-2 hover:scale-95"
          onClick={handleLogout}
        >
          로그아웃
        </button>
      </div>

      {/* 설정 모달 */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-lg font-semibold">프로필 수정</h2>
              <button
                className="h-8 w-8 rounded-full hover:bg-black/5"
                onClick={() => setOpen(false)}
                aria-label="닫기"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSave} className="px-6 py-5 space-y-4">
              <div className='flex items-center gap-5'>
                <div className="flex items-center gap-3">
                    <img
                      src={avatar.trim() ? avatar : DEFAULT_AVATAR}
                      alt="미리보기"
                      className="h-17 w-17 rounded-full object-cover border"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = DEFAULT_AVATAR;
                      }}
                    />
                </div>
                <div className='flex-1'>
                  <label className="text-sm text-black/70">이름 *</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-pink-400"
                    placeholder="이름"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-black/70">Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="mt-1 w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-pink-400"
                  placeholder="간단한 소개를 적어주세요"
                  rows={3}
                />
              </div>

              <div>
                <label className="text-sm text-black/70">
                  프로필 사진 URL
                </label>
                <input
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  className="mt-1 w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-pink-400"
                  placeholder="https://example.com/avatar.png"
                />
              </div>

              <button
                type="submit"
                disabled={isPending || !name.trim()}
                className="w-full rounded-md bg-pink-500 text-white py-2.5 font-medium disabled:opacity-60 disabled:cursor-not-allowed hover:bg-pink-600"
              >
                {isPending ? "저장 중..." : "저장"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPage;
