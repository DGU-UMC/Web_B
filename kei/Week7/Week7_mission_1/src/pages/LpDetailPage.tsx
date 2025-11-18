import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import useGetLp from "../hooks/queries/useGetLp";
import { useAuth } from "../context/AuthContext";
import useLikeLp from "../hooks/mutations/useLikeLp";
import useDeleteLp from "../hooks/mutations/useDeleteLp";
import { useEffect, useRef, useState } from "react";
import { axiosInstance } from "../apis/axios";
import ComFirmModal from "../components/ComFirmModal";
import { useInView } from "react-intersection-observer";
import useGetInfiniteLpComments from "../hooks/queries/useGetInfiniteLpComments";
import useCreateComment from "../hooks/mutations/useCreateComment";
import useUpdateComment from "../hooks/mutations/useUpdateComment";
import useDeleteComment from "../hooks/mutations/useDeleteComment";
import CommentSkeletonList from "../components/Comment/CommentSkeletonList";
import { PAGINATION_ORDER } from "../enums/common";
import useUpdateLp from "../hooks/mutations/useUpdateLp";

function formatRelativeKR(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  const diff = (Date.now() - d.getTime()) / 1000;
  if (diff < 60) return "방금 전";
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  return `${Math.floor(diff / 86400)}일 전`;
}

export default function LpDetailPage() {
  const { lpid } = useParams();
  const idNum = Number(lpid);
  const { accessToken } = useAuth();
  const nav = useNavigate();
  const location = useLocation();

  const [editorName, setEditorName] = useState("");
  const isGuest = !accessToken;

    //  로그인 상태에서만 데이터 패칭
  const { data: lp, isPending, error, refetch } = useGetLp(lpid);

  useEffect(() => {
    if (!lp?.authorId) {
      setEditorName("");
      return;
    }
    let ignore = false;
    (async () => {
      try {
        const res = await axiosInstance.get(`/v1/users/${lp.authorId}`);
        const name = res?.data?.data?.name ?? res?.data?.name ?? "";
        if (!ignore) setEditorName(name);
      } catch (e) {
        if (!ignore) setEditorName("");
        console.log("업데이트한 사용자 정보 불러오기 실패", e);
      }
    })();
    return () => {
      ignore = true;
    };
  }, [lp?.authorId]);

  const [editMode, setEditMode] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (!lp) return;
    if (!editMode) {
      setTitle(lp.title ?? "");
      setContent(lp.content ?? "");
      setThumbnail(lp.thumbnail ?? "");
      setTags(lp.tags?.map((t) => t.name) ?? []);
    }
  }, [lp, editMode]);

  const likeMut = useLikeLp(idNum);
  const delMut = useDeleteLp(idNum);
  const { mutateAsync: updateLp, isPending: saving } = useUpdateLp(idNum);

  // 비로그인자는 페이지 컨텐츠를 전혀 노출하지 않고 모달만 표시
  if (isGuest) {
    return (
      <ComFirmModal
        open
        title="로그인이 필요합니다"
        message="LP 상세를 보려면 로그인해 주세요."
        confirmText="로그인"
        cancelText="홈으로"
        onConfirm={() =>
          nav("/login", { state: { from: location }, replace: true })
        }
        onCancel={() => nav("/", { replace: true })}
      />
    );
  }

  if (isPending) return <div className="p-6">Loading…</div>;

  if (error) {
    return (
      <div className="p-6 space-y-3">
        <div>불러오기 실패: {error.message}</div>
        <button
          onClick={() => refetch()}
          className="px-3 py-2 rounded bg-zinc-800 text-white"
        >
          다시 시도
        </button>
      </div>
    );
  }

  if (!lp) return <div className="p-6">데이터가 없습니다.</div>;

  const rel = formatRelativeKR(lp.updatedAt);
  const likeCount = Array.isArray(lp.likes) ? lp.likes.length : 0;

  const isOwner = Boolean(lp.authorId);

  const handleSave = async () => {
    try {
      await updateLp({
        title: title.trim(),
        content: content.trim(),
        thumbnail: (thumbnail ?? "").trim(),
        tags: Array.from(new Set(tags.map(t => t.trim()).filter(Boolean))),
        published: lp.published ?? true,
      });
      setEditMode(false);
    } catch (e: any) {
      const msg = e?.response?.data?.message || "저장에 실패했습니다.";
      alert(msg); 
    }
  };

  const handlePickFile = () => fileRef.current?.click();
  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    // 미션 요구: 파일로 선택 → 미리보기 + 상태 반영
    const reader = new FileReader();
    reader.onload = () => {
      const dataURL = String(reader.result);
      setThumbnail(dataURL); // 서버가 URL만 받는다면 업로드 API로 바꾸고 여기에 업로드 후 받은 URL을 set해도 됨
    };
    reader.readAsDataURL(f);
  };

  const addTag = () => {
    const t = tagInput.trim();
    if (!t) return;
    if (tags.includes(t)) {
      setTagInput("");
      return;
    }
    setTags((prev) => [...prev, t]);
    setTagInput("");
  };
  const removeTag = (name: string) =>
    setTags((prev) => prev.filter((t) => t !== name));

  const handleLike = () => {
    if (likeMut.isPending) return;
    likeMut.mutate();
  };

  const handleDelete = async () => {
    if (!confirm("정말 삭제하시겠어요?")) return;
    try {
      await delMut.mutateAsync();
      alert("삭제되었습니다.");
      nav("/");
    } catch {
      alert("삭제 실패");
    }
  };

  return (
    <div className="m-10 rounded-xl bg-zinc-500/85 shadow-2xl p-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="leading-tight">
            <div className="text-sm text-zinc-300">{editorName}</div>
              {editMode ? (
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1 w-full rounded px-3 py-2 bg-zinc-800 text-zinc-100 outline-none focus:ring-2 focus:ring-pink-400"
                  placeholder="제목"
                />
              ) : (
                <h1 className="text-2xl font-semibold text-zinc-100">{lp.title}</h1>
              )}
          </div>
        </div>

        <div className="flex items-center gap-4 text-zinc-800">
          <span className="text-sm">{rel}</span>
          {isOwner && !editMode && (
            <>
              <button aria-label="수정" className="hover:text-zinc-200" onClick={() => setEditMode(true)}>
                <svg width="18" height="18" viewBox="0 0 24 24" className="fill-current">
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25Zm18-11.5a1 1 0 0 0 0-1.41L18.66 1.99a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75L21 5.75Z"/>
                </svg>
              </button>
              <button aria-label="삭제" className="hover:text-zinc-200" onClick={handleDelete}>
                <svg width="18" height="18" viewBox="0 0 24 24" className="fill-current">
                  <path d="M9 3h6a1 1 0 0 1 1 1v1h4v2H4V5h4V4a1 1 0 0 1 1-1Zm1 6h2v9h-2V9Zm4 0h2v9h-2V9ZM6 9h2v9H6V9Z"/>
                </svg>
              </button>
            </>
          )}

          {isOwner && editMode && (
            <>
              <button
                onClick={handleSave}
                disabled={saving}
                className="rounded px-3 py-1 bg-blue-500 text-white disabled:opacity-60"
              >
                {saving ? "저장 중…" : "저장"}
              </button>
              <button
                onClick={() => {
                  // 원본으로 롤백
                  setEditMode(false);
                  setTitle(lp.title ?? "");
                  setContent(lp.content ?? "");
                  setThumbnail(lp.thumbnail ?? "");
                  setTags(lp.tags?.map((t) => t.name) ?? []);
                  setTagInput("");
                }}
                className="rounded px-3 py-1 bg-zinc-700 text-white"
              >
                취소
              </button>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center justify-center">
        <div className="m-10 w-100 h-100 rounded-xl bg-zinc-800/50 p-5 shadow-xl">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <img
            src={editMode ? (thumbnail || "/images/noimage.png") : lp.thumbnail}
            alt={title || lp.title}
            onClick={editMode ? handlePickFile : undefined}
            className={`w-90 h-90 rounded-lg object-cover`}
          />
          {editMode && (
            <p className="mt-1 ml-2 text-xs text-zinc-300">
              이미지 클릭 → 파일 선택
            </p>
          )}
        </div>
      </div>

      {editMode ? (
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="mx-10 w-[calc(100%-5rem)] min-h-40 rounded bg-zinc-800 text-zinc-100 p-3 outline-none focus:ring-2 focus:ring-pink-400"
          placeholder="내용을 입력하세요"
        />
      ) : (
        <p className="ml-10 mr-10 leading-7 whitespace-pre-line text-zinc-200">
          {lp.content}
        </p>
      )}

<div className="mx-10 mt-4">
        {editMode && (
          <div className="mb-3 flex gap-2">
            <input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTag();
                }
              }}
              className="flex-1 rounded bg-zinc-800 text-white px-3 py-2 outline-none focus:ring-2 focus:ring-pink-400"
              placeholder="태그 입력 후 Add (Enter 가능)"
            />
            <button
              type="button"
              onClick={addTag}
              className="px-3 py-2 rounded bg-pink-500 text-white"
            >
              Add
            </button>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {(editMode ? tags : lp.tags?.map((t) => t.name) ?? []).map((name) => (
            <span
              key={name}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-700 text-zinc-200 text-sm"
            >
              #{name}
              {editMode && (
                <button
                  onClick={() => removeTag(name)}
                  className="text-zinc-300 hover:text-white"
                  aria-label={`${name} 삭제`}
                >
                  ×
                </button>
              )}
            </span>
          ))}
        </div>
      </div>

      <CommentsSection lpId={idNum} />

      <div className="mt-6 flex items-center justify-center gap-2 text-rose-300">
        <button
          onClick={handleLike}
          disabled={likeMut.isPending}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-600 hover:bg-rose-700 text-white disabled:opacity-60"
          aria-label="좋아요"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" className="fill-current">
            <path d="M12.1 21.35 10 19.45C5.4 15.36 2 12.28 2 8.5A4.5 4.5 0 0 1 6.5 4c1.74 0 3.41.81 4.5 2.09A6 6 0 0 1 15.5 4 4.5 4.5 0 0 1 20 8.5c0 3.78-3.4 6.86-8 10.95l-.9.9Z" />
          </svg>
          <span className="text-zinc-100">{likeCount}</span>
        </button>
      </div>

      <Link to="/" className="mt-6 block cursor:pointer text-blue-700 hover:underline">
        ← 목록으로
      </Link>
    </div>
  );

  function CommentsSection({ lpId }: { lpId: number }) {
    const [order, setOrder] = useState<PAGINATION_ORDER>(PAGINATION_ORDER.desc);
    const [input, setInput] = useState("");
    const { ref, inView } = useInView({ threshold: 0 });

    const {
      data,
      isPending,
      isFetchingNextPage,
      hasNextPage,
      fetchNextPage,
      refetch,
      isError,
    } = useGetInfiniteLpComments(lpId, order, 10);

    const createMut = useCreateComment(lpId, order);
    const updateMut = useUpdateComment(lpId, order);
    const deleteMut = useDeleteComment(lpId, order);

    useEffect(() => {
      if (inView && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const content = input.trim();
      if (!content) return;
      createMut.mutate(content, {
        onSuccess: () => setInput(""),
      });
    };

    const pages = data?.pages ?? [];
    const comments = pages.flatMap((p) => p.data.data);

    return (
      <section className="mt-6">
        <div className="flex items-center gap-2 mb-3">
          <button
            onClick={() => setOrder(PAGINATION_ORDER.asc)}
            className={`px-3 py-1 rounded ${
              order === "asc" ? "bg-zinc-200 text-zinc-900" : "bg-zinc-700 text-zinc-200"
            }`}
          >
            오래된순
          </button>
          <button
            onClick={() => setOrder(PAGINATION_ORDER.desc)}
            className={`px-3 py-1 rounded ${
              order === "desc" ? "bg-zinc-200 text-zinc-900" : "bg-zinc-700 text-zinc-200"
            }`}
          >
            최신순
          </button>

          {isError && (
            <button
              onClick={() => refetch()}
              className="ml-auto px-3 py-1 rounded bg-red-500 text-white"
            >
              다시 시도
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="댓글을 입력해주세요"
            className="flex-1 px-3 py-2 rounded bg-zinc-800 text-white"
          />
          <button
            type="submit"
            disabled={createMut.isPending || input.trim().length === 0}
            className="px-3 py-2 rounded bg-emerald-600 text-white disabled:opacity-60"
          >
            작성
          </button>
        </form>

        {isPending && <CommentSkeletonList count={8} />}

        {!isPending &&
          comments.map((c) => (
            <div key={c.id} className="flex items-start gap-3 py-3">
              <div className="w-8 h-8 rounded-full bg-rose-500 grid place-items-center text-white text-sm">
                {c.author.name?.slice(0, 1) ?? "."}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 text-sm text-zinc-300">
                  <span>{c.author.name}</span>
                  <span className="opacity-60">
                    {new Date(c.createdAt).toLocaleString()}
                  </span>
                  {/* 예시: 본인 댓글만 수정/삭제 */}
                  <div className="ml-auto flex gap-2">
                    <button
                      className="text-blue-400 hover:underline"
                      onClick={() => {
                        const next = prompt("댓글 수정", c.content);
                        if (next != null) {
                          updateMut.mutate({ commentId: c.id, content: next });
                        }
                      }}
                    >
                      수정
                    </button>
                    <button
                      className="text-red-400 hover:underline"
                      onClick={() => {
                        if (confirm("삭제할까요?")) deleteMut.mutate(c.id);
                      }}
                    >
                      삭제
                    </button>
                  </div>
                </div>
                <p className="text-zinc-100 mt-1">{c.content}</p>
              </div>
            </div>
          ))}

        {isFetchingNextPage && <CommentSkeletonList count={5} />}

        <div ref={ref} className="h-6" />
      </section>
    );
  }
}