import { useEffect, useRef, useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit?: (data: { name: string; content: string; tags: string[]; file?: File | null }) => void;
};

export default function LPWriteModal({ open, onClose, onSubmit }: Props) {
  const firstInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    firstInputRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  const addTag = () => {
    if (!tagInput.trim()) return;
    if (tags.includes(tagInput.trim())) return; // 중복 방지
    setTags((prev) => [...prev, tagInput.trim()]);
    setTagInput("");
  };

  const removeTag = (tagToRemove: string) => {
    setTags((prev) => prev.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.({ name, content, tags, file });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[1100] bg-black/50 flex items-center justify-center px-4"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-lg rounded-2xl bg-neutral-800 text-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between px-6 py-4 border-b border-white/10">
          <h2 className="text-lg font-semibold">LP 글 작성</h2>
          <button className="h-8 w-8 hover:bg-white/10 rounded-full" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* 파일 업로드 (필수 요구사항) */}
          <div className="space-y-1">
            <label className="text-sm text-white/80">LP 사진 업로드</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="
                block w-full rounded-lg border border-white/10 bg-neutral-900
                file:mr-4 file:rounded-md file:border-0 file:bg-pink-500 file:px-3 file:py-2 file:text-white
                hover:file:bg-pink-600
              "
            />
          </div>

          {/* 이름 */}
          <div className="space-y-1">
            <label className="text-sm text-white/80" htmlFor="lp-name">LP Name</label>
            <input
              id="lp-name"
              ref={firstInputRef}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg bg-neutral-900 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-pink-400"
              placeholder="예) Dark Side of the Moon"
            />
          </div>

          {/* 내용 */}
          <div className="space-y-1">
            <label className="text-sm text-white/80" htmlFor="lp-content">LP Content</label>
            <input
              id="lp-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full rounded-lg bg-neutral-900 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-pink-400"
              placeholder="한 줄 소개를 적어 주세요"
            />
          </div>

          {/* 태그 입력 */}
          <div className="flex gap-2">
            <input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              className="flex-1 p-2 rounded bg-neutral-700"
              placeholder="태그 입력"
            />
            <button type="button" onClick={addTag} className="px-4 bg-neutral-600 rounded">Add</button>
          </div>

          {/* 태그 리스트 */}
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span key={tag} className="px-3 py-1 bg-neutral-600 rounded-full flex items-center gap-2">
                {tag}
                <button type="button" onClick={() => removeTag(tag)} className="text-sm hover:text-pink-400">×</button>
              </span>
            ))}
          </div>

          <button type="submit" className="w-full py-3 rounded bg-pink-500 hover:bg-pink-600">Add LP</button>
        </form>
      </div>
    </div>
  );
}
