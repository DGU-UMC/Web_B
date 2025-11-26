import { useParams, useNavigate } from "react-router-dom";
import useGetLp from "../hooks/queries/useGetLp";
import useUpdateLp from "../hooks/mutations/useUpdateLp";
import { useState, useEffect } from "react";

export default function LpEditPage() {
  const { lpid } = useParams();
  const idNum = Number(lpid);
  const nav = useNavigate();

  const { data: lp, isPending } = useGetLp(lpid);
  const { mutateAsync: updateLp, isPending: saving } = useUpdateLp(idNum);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [tagsText, setTagsText] = useState("");
  const [published, setPublished] = useState(true);

  useEffect(() => {
    if (!lp) return;
    setTitle(lp.title ?? "");
    setContent(lp.content ?? "");
    setThumbnail(lp.thumbnail ?? "");
    setTagsText(lp.tags?.map(t => t.name).join(",") ?? "");
    setPublished(!!lp.published);
  }, [lp]);

  if (isPending || !lp) return <div className="p-6">Loading...</div>;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const tags = tagsText
      .split(",")
      .map(s => s.trim())
      .filter(Boolean);

    await updateLp({ title, content, thumbnail, tags, published });
    nav(`/lp/${idNum}`);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">LP 수정</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full px-3 py-2 rounded bg-zinc-800 text-white"
          placeholder="제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="w-full px-3 py-2 rounded bg-zinc-800 text-white"
          placeholder="썸네일 URL"
          value={thumbnail}
          onChange={(e) => setThumbnail(e.target.value)}
        />
        <textarea
          className="w-full px-3 py-2 rounded bg-zinc-800 text-white min-h-40"
          placeholder="내용"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <input
          className="w-full px-3 py-2 rounded bg-zinc-800 text-white"
          placeholder="태그(쉼표로 구분) 예: typescript, nestjs, programming"
          value={tagsText}
          onChange={(e) => setTagsText(e.target.value)}
        />
        <label className="inline-flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
          />
          공개
        </label>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 rounded bg-emerald-600 text-white disabled:opacity-60"
          >
            {saving ? "저장 중..." : "저장"}
          </button>
          <button
            type="button"
            onClick={() => nav(-1)}
            className="px-4 py-2 rounded bg-zinc-700 text-white"
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
}
