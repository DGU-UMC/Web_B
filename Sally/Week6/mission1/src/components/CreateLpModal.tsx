import { useState, useRef, useEffect } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { createLp, uploadImage } from "../apis/lp";
import { QUERY_KEY } from "../constants/key";
import { useAuth } from "../context/AuthContext";

interface CreateLpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateLpModal = ({ isOpen, onClose }: CreateLpModalProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [errors, setErrors] = useState({
    title: "",
    content: "",
    thumbnail: "",
  });
  const modalRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const { accessToken } = useAuth();

  // LP 생성 mutation
  const createLpMutation = useMutation({
    mutationFn: async (lpData: {
      title: string;
      content: string;
      thumbnail?: string;
      tags?: string[];
      published: boolean;
    }) => {
      return createLp(lpData);
    },
    onSuccess: () => {
      // 성공 시 폼 초기화 및 모달 닫기
      setTitle("");
      setContent("");
      setThumbnail(null);
      setThumbnailPreview(null);
      setTags([]);
      setTagInput("");
      setErrors({ title: "", content: "", thumbnail: "" });
      onClose();

      // LP 목록 새로고침
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.lps],
      });
    },
    onError: (error: unknown) => {
      const axiosError = error as {
        response?: {
          data?: { message?: string; error?: string; errors?: unknown };
        };
        message?: string;
      };
      const errorMessage: string =
        axiosError?.response?.data?.message ||
        axiosError?.response?.data?.error ||
        (axiosError?.response?.data?.errors
          ? String(JSON.stringify(axiosError.response.data.errors))
          : "") ||
        axiosError?.message ||
        "LP 작성에 실패했습니다. 다시 시도해주세요.";
      setErrors((prev) => ({
        ...prev,
        title: errorMessage,
      }));
    },
  });

  // 모달 바깥 영역 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  // 파일 선택 핸들러
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 이미지 파일만 허용
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          thumbnail: "이미지 파일만 업로드 가능합니다.",
        }));
        return;
      }
      setThumbnail(file);
      setErrors((prev) => ({ ...prev, thumbnail: "" }));

      // 미리보기 생성
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveFile = () => {
    setThumbnail(null);
    setThumbnailPreview(null);
    setErrors((prev) => ({ ...prev, thumbnail: "" }));
  };

  // 태그 추가
  const handleAddTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setTagInput("");
    }
  };

  // 태그 삭제
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  // 폼 제출
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 유효성 검사
    const newErrors = {
      title: "",
      content: "",
      thumbnail: "",
    };

    if (!title.trim()) {
      newErrors.title = "제목을 입력해주세요.";
    }
    if (!content.trim()) {
      newErrors.content = "본문을 입력해주세요.";
    }

    if (newErrors.title || newErrors.content) {
      setErrors(newErrors);
      return;
    }

    // 1단계: 이미지가 있으면 먼저 업로드
    let thumbnailUrl: string | undefined = undefined;
    if (thumbnail) {
      try {
        const uploadResponse = await uploadImage(thumbnail, !accessToken);
        thumbnailUrl = uploadResponse.imageUrl;
      } catch (uploadError: unknown) {
        const axiosError = uploadError as {
          response?: { data?: { message?: string } };
        };
        setErrors((prev) => ({
          ...prev,
          thumbnail:
            axiosError?.response?.data?.message ||
            "이미지 업로드에 실패했습니다.",
        }));
        return;
      }
    }

    // 2단계: LP 작성 (받은 imageUrl 사용) - useMutation 사용
    const lpData = {
      title: title.trim(),
      content: content.trim(),
      thumbnail: thumbnailUrl,
      tags: tags.length > 0 ? tags : undefined,
      published: true,
    };
    createLpMutation.mutate(lpData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold">새 LP 작성</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="닫기"
          >
            X
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              제목
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setErrors((prev) => ({ ...prev, title: "" }));
              }}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.title ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="LP 제목을 입력하세요"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-500">{errors.title}</p>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              본문
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                setErrors((prev) => ({ ...prev, content: "" }));
              }}
              rows={8}
              className={`w-full px-4 py-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.content ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="LP 본문을 입력하세요"
            />
            {errors.content && (
              <p className="mt-1 text-sm text-red-500">{errors.content}</p>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="thumbnail"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              썸네일 이미지
            </label>
            <input
              type="file"
              id="thumbnail"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.thumbnail && (
              <p className="mt-1 text-sm text-red-500">{errors.thumbnail}</p>
            )}

            {thumbnailPreview && (
              <div className="mt-4 relative">
                <img
                  src={thumbnailPreview}
                  alt="썸네일 미리보기"
                  className="w-full h-48 object-cover rounded-lg border border-gray-300"
                />
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
                  aria-label="이미지 제거"
                >
                  X
                </button>
              </div>
            )}
          </div>

          <div className="mb-6">
            <label
              htmlFor="tagInput"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              태그
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                id="tagInput"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="태그를 입력하세요"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                추가
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-blue-600 hover:text-blue-800 font-bold"
                      aria-label={`${tag} 태그 삭제`}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={createLpMutation.isPending}
              className="px-6 py-2 bg-pink-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createLpMutation.isPending ? "작성 중..." : "작성"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateLpModal;
