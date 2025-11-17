import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import useGetMyInfo from "../hooks/queries/useGetMyInfo";
import { useNavigate } from "react-router-dom";
import useUpdateProfile from "../hooks/mutations/useUpdateProfile";
import { uploadImage } from "../apis/upload";

const MyPage = () => {
  const navigate = useNavigate();
  const { logout, accessToken } = useAuth();
  const { data: me, isPending } = useGetMyInfo(accessToken);
  const { mutateAsync: updateProfile, isPending: isUpdating } =
    useUpdateProfile();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    if (me?.data) {
      setName(me.data.name ?? "");
      setBio(me.data.bio ?? "");
      setAvatarUrl(me.data.avatar ?? "");
    }
  }, [me]);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const handleUpdate = async () => {
    let finalAvatar = avatarUrl || undefined;
    if (avatarFile) {
      const res = await uploadImage(avatarFile, false);
      finalAvatar =
        res.data?.data?.imageUrl || res.data?.imageUrl || finalAvatar;
    }
    await updateProfile(
      {
        name,
        bio: bio || null,
        avatar: finalAvatar ?? null,
      },
      {
        onSuccess: () => {
          setIsEditOpen(false);
          setAvatarFile(null);
        },
      }
    );
  };

  return (
    <div className="pt-24 pb-10 px-4 flex justify-center">
      <div className="w-full max-w-3xl space-y-4">
        {isPending ? (
          <div className="p-6 text-center">내 정보 로딩 중...</div>
        ) : (
          <>
            <div className="flex items-center gap-4">
              <img
                src={
                  me?.data?.avatar ||
                  "https://via.placeholder.com/120x120.png?text=Avatar"
                }
                alt="프로필"
                className="w-24 h-24 rounded-full object-cover"
              />
              <div>
                <h1 className="text-2xl font-bold">{me?.data?.name}</h1>
                <p className="text-gray-600">{me?.data?.email}</p>
                <p className="text-gray-700 mt-2">
                  {me?.data?.bio || "소개가 없습니다."}
                </p>
              </div>
            </div>

            <div className="space-x-2">
              <button
                className="px-4 py-2 bg-gray-800 text-white rounded-md"
                onClick={() => setIsEditOpen(true)}
              >
                설정
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-md"
                onClick={handleLogout}
              >
                로그아웃
              </button>
            </div>
          </>
        )}

        {isEditOpen && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setIsEditOpen(false)}
          >
            <div
              className="bg-white rounded-lg p-6 w-96 text-black relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-2 right-3"
                onClick={() => setIsEditOpen(false)}
                aria-label="close"
              >
                ✕
              </button>
              <h2 className="text-xl font-semibold mb-4">프로필 설정</h2>

              <label className="block text-sm font-medium mb-1">이름</label>
              <input
                className="w-full border border-gray-300 rounded-md px-3 py-2 mb-3"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="이름을 입력하세요"
              />

              <label className="block text-sm font-medium mb-1">Bio</label>
              <textarea
                className="w-full border border-gray-300 rounded-md px-3 py-2 mb-3"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="소개를 입력하세요 (비워도 저장 가능)"
              />

            <label className="block text-sm font-medium mb-1">
              프로필 사진 URL (선택)
            </label>
            <input
              className="w-full border border-gray-300 rounded-md px-3 py-2 mb-3"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="이미지 URL을 입력하세요"
            />
            <label className="block text-sm font-medium mb-1">
              프로필 사진 업로드 (선택)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setAvatarFile(file);
              }}
            />
            {avatarFile && (
              <p className="text-sm text-gray-600 mt-1">
                선택됨: {avatarFile.name}
              </p>
            )}

              <button
                className="w-full mt-4 bg-pink-600 text-white py-2 rounded-md disabled:bg-gray-300"
                onClick={handleUpdate}
                disabled={isUpdating || !name}
              >
                {isUpdating ? "저장 중..." : "저장"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPage;
