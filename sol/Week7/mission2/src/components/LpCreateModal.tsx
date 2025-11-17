import { useEffect, useState } from "react";
import useCreateLp from "../hooks/mutations/useCreateLp";
import { uploadImage } from "../apis/upload";

interface LpCreateModalProps {
  onClose: () => void;
}

const LpCreateModal = ({ onClose }: LpCreateModalProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  const { mutateAsync: createLp, isPending } = useCreateLp();

  const handleAddTag = () => {
    const next = tagInput.trim();
    if (!next) return;
    if (tags.includes(next)) {
      setTagInput("");
      return;
    }
    setTags((prev) => [...prev, next]);
    setTagInput("");
  };

  const handleRemoveTag = (target: string) => {
    setTags((prev) => prev.filter((tag) => tag !== target));
  };

  const handleSubmit = async () => {
    let finalThumbnail = thumbnailUrl || undefined;
    if (thumbnailFile) {
      const res = await uploadImage(thumbnailFile, true);
      finalThumbnail =
        res.data?.data?.imageUrl || res.data?.imageUrl || finalThumbnail;
    }
    await createLp(
      {
        title,
        content,
        published: true,
        tags,
        thumbnail: finalThumbnail,
      },
      {
        onSuccess: () => {
          setTitle("");
          setContent("");
          setTags([]);
          setThumbnailUrl("");
          setThumbnailFile(null);
          onClose();
        },
      }
    );
  };

  const isDisabled = !title || !content || isPending;

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white text-black rounded-lg shadow-lg w-11/12 max-w-2xl p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
          onClick={onClose}
          aria-label="close"
        >
          ✕
        </button>
        <h2 className="text-xl font-bold mb-4">LP 추가</h2>

        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">제목</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            placeholder="LP 제목을 입력하세요"
          />
        </div>

        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">내용</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 h-24"
            placeholder="LP 소개를 입력하세요"
          />
        </div>

        <div className="mb-3 flex items-center gap-2">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">태그</label>
            <input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="태그를 입력 후 추가 버튼을 눌러주세요"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
            />
          </div>
          <button
            type="button"
            className="mt-6 px-4 py-2 bg-gray-800 text-white rounded-md"
            onClick={handleAddTag}
          >
            추가
          </button>
        </div>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-gray-200 rounded-full text-sm flex items-center gap-2"
              >
                #{tag}
                <button
                  type="button"
                  className="text-red-500"
                  onClick={() => handleRemoveTag(tag)}
                  aria-label={`${tag} 태그 삭제`}
                >
                  x
                </button>
              </span>
            ))}
          </div>
        )}

        {/* <div className="mb-3">
          <label className="block text-sm font-medium mb-1">
            썸네일 URL (선택)
          </label>
          <input
            value={thumbnailUrl}
            onChange={(e) => setThumbnailUrl(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            placeholder="이미지 URL을 입력하세요"
          />
        </div> */}

        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">
            썸네일 파일 업로드 (선택)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setThumbnailFile(file);
            }}
          />
          {thumbnailFile && (
            <p className="text-sm text-gray-600 mt-1">
              선택됨: {thumbnailFile.name}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isDisabled}
          className="w-full bg-pink-600 text-white font-semibold py-2 rounded-md disabled:bg-gray-300"
        >
          {isPending ? "등록 중..." : "Add LP"}
        </button>
      </div>
    </div>
  );
};

export default LpCreateModal;
