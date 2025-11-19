import { useEffect, useMemo, useState } from "react";
import { Outlet } from "react-router-dom";
import { getMyInfo } from "../apis/auth";
import type { ResponseMyInfoDTO } from "../types/auth";
import { useAuth } from "../context/AuthContext";
import useUpdateProfile from "../hooks/mutations/useUpdateProfile";
import { uploadImage } from "../apis/lp";

type UserProfile = ResponseMyInfoDTO["data"];

const Mypage = () => {
  const { updateUserInfo } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [bioInput, setBioInput] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [shouldRemoveAvatar, setShouldRemoveAvatar] = useState(false);
  const { mutateAsync: updateProfile, isPending } = useUpdateProfile();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getMyInfo();
        setProfile(response.data);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    if (!profile || isEditing) {
      return;
    }

    setNameInput(profile.name);
    setBioInput(profile.bio ?? "");
    setAvatarPreview(profile.avatar);
    setAvatarFile(null);
    setShouldRemoveAvatar(false);
  }, [isEditing, profile]);

  const handleEnterEditMode = () => {
    if (!profile) {
      return;
    }
    setNameInput(profile.name);
    setBioInput(profile.bio ?? "");
    setAvatarPreview(profile.avatar);
    setAvatarFile(null);
    setShouldRemoveAvatar(false);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    if (profile) {
      setNameInput(profile.name);
      setBioInput(profile.bio ?? "");
      setAvatarPreview(profile.avatar);
    }
    setAvatarFile(null);
    setShouldRemoveAvatar(false);
    setIsEditing(false);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      return;
    }

    setAvatarFile(file);
    setShouldRemoveAvatar(false);

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
    setShouldRemoveAvatar(true);
  };

  const hasChanges = useMemo(() => {
    if (!profile) {
      return false;
    }

    const trimmedName = nameInput.trim();
    const trimmedBio = bioInput.trim();
    const normalizedBio = trimmedBio === "" ? null : trimmedBio;

    const nameChanged = trimmedName !== profile.name;
    const bioChanged = normalizedBio !== profile.bio;
    const avatarChanged =
      shouldRemoveAvatar ||
      avatarFile !== null ||
      avatarPreview !== (profile.avatar ?? null);

    return nameChanged || bioChanged || avatarChanged;
  }, [
    avatarFile,
    avatarPreview,
    bioInput,
    nameInput,
    profile,
    shouldRemoveAvatar,
  ]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!profile) {
      return;
    }

    const trimmedName = nameInput.trim();
    if (!trimmedName) {
      return;
    }

    const trimmedBio = bioInput.trim();
    const normalizedBio = trimmedBio === "" ? null : trimmedBio;

    const payload: {
      name?: string;
      bio?: string | null;
      avatar?: string | null;
    } = {};

    if (trimmedName !== profile.name) {
      payload.name = trimmedName;
    }

    if (normalizedBio !== profile.bio) {
      payload.bio = normalizedBio;
    }

    if (shouldRemoveAvatar && profile.avatar) {
      payload.avatar = null;
    } else if (avatarFile) {
      const uploadResult = await uploadImage(avatarFile);
      payload.avatar = uploadResult.imageUrl;
    }

    if (Object.keys(payload).length === 0) {
      setIsEditing(false);
      return;
    }

    const response = await updateProfile(payload);
    const updatedProfile = response.data;
    setProfile(updatedProfile);
    updateUserInfo({ name: updatedProfile.name });
    setIsEditing(false);
    setAvatarFile(null);
    setShouldRemoveAvatar(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Outlet />
      <div className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-10">
        <div className="rounded-2xl bg-white p-6 ">
          {isLoading ? (
            <div className="py-10 text-center text-gray-500">
              불러오는 중...
            </div>
          ) : profile ? (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col items-center gap-6 md:flex-row md:items-start md:gap-10"
            >
              <div className="flex flex-col items-center gap-4">
                <div className="h-32 w-32 overflow-hidden rounded-full border border-gray-200 bg-gray-50 shadow-inner">
                  {(isEditing ? avatarPreview : profile.avatar) ? (
                    <img
                      src={(isEditing ? avatarPreview : profile.avatar) ?? ""}
                      alt={`${profile.name}의 프로필 이미지`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-2xl font-semibold text-gray-400">
                      {(isEditing ? nameInput : profile.name).charAt(0)}
                    </div>
                  )}
                </div>
                {isEditing ? (
                  <div className="flex flex-col items-center gap-2 text-sm">
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-gray-300 px-4 py-2 font-medium text-gray-600 transition-colors hover:bg-gray-100">
                      이미지 선택
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </label>
                    {(avatarPreview || profile.avatar) && (
                      <button
                        type="button"
                        onClick={handleRemoveAvatar}
                        className="text-xs text-red-500 hover:underline"
                      >
                        프로필 사진 제거
                      </button>
                    )}
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleEnterEditMode}
                    className="rounded-full border border-gray-300 px-5 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100"
                  >
                    설정
                  </button>
                )}
              </div>

              <div className="flex-1 space-y-6 self-stretch">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    이름 <span className="text-red-500">*</span>
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={nameInput}
                      onChange={(event) => setNameInput(event.target.value)}
                      maxLength={50}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      placeholder="이름을 입력하세요"
                    />
                  ) : (
                    <h1 className="text-2xl font-bold text-gray-900">
                      {profile.name}님 환영합니다.
                    </h1>
                  )}
                  <p className="text-sm text-gray-500">{profile.email}</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Bio (선택)
                  </label>
                  {isEditing ? (
                    <textarea
                      value={bioInput}
                      onChange={(event) => setBioInput(event.target.value)}
                      rows={4}
                      maxLength={500}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      placeholder="자기소개를 입력하세요 (비워둬도 됩니다)"
                    />
                  ) : (
                    <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 text-sm text-gray-600">
                      {profile.bio && profile.bio.trim().length > 0
                        ? profile.bio
                        : "아직 작성된 Bio가 없습니다."}
                    </div>
                  )}
                </div>

                {isEditing ? (
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="rounded-full border border-gray-300 px-5 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100"
                      disabled={isPending}
                    >
                      취소
                    </button>
                    <button
                      type="submit"
                      disabled={isPending || !hasChanges}
                      className="rounded-full bg-blue-500 px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isPending ? "저장 중..." : "저장"}
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleEnterEditMode}
                    className="rounded-full border border-gray-300 px-5 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 md:hidden"
                  >
                    설정
                  </button>
                )}
              </div>
            </form>
          ) : (
            <div className="py-10 text-center text-gray-500">
              사용자 정보를 찾을 수 없습니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Mypage;
