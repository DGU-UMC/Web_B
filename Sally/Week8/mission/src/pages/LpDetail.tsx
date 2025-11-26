import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useGetLpDetail from "../hooks/queries/useGetLpDetail";
import useGetLpComments from "../hooks/queries/useGetLpComments";
import useCreateLpComment from "../hooks/mutations/useCreateLpComment";
import useUpdateLpComment from "../hooks/mutations/useUpdateLpComment";
import useDeleteLpComment from "../hooks/mutations/useDeleteLpComment";
import useUpdateLp from "../hooks/mutations/useUpdateLp";
import useDeleteLp from "../hooks/mutations/useDeleteLp";
import { useAuth } from "../context/AuthContext";
import { PAGINATION_ORDER } from "../enum/common";

const LpDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useGetLpDetail(id);
  const { accessToken, userId } = useAuth();
  const [commentOrder, setCommentOrder] = useState<PAGINATION_ORDER>(
    PAGINATION_ORDER.desc
  );
  const [commentContent, setCommentContent] = useState("");
  const [commentError, setCommentError] = useState("");
  const [activeMenuCommentId, setActiveMenuCommentId] = useState<number | null>(
    null
  );
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const [editingError, setEditingError] = useState("");
  const { mutateAsync: createCommentMutate, isPending: isCreatingComment } =
    useCreateLpComment(id);
  const { mutateAsync: updateCommentMutate, isPending: isUpdatingComment } =
    useUpdateLpComment(id);
  const { mutateAsync: deleteCommentMutate, isPending: isDeletingComment } =
    useDeleteLpComment(id);
  const { mutateAsync: updateLpMutate, isPending: isUpdatingLp } =
    useUpdateLp(id);
  const { mutateAsync: deleteLpMutate, isPending: isDeletingLp } =
    useDeleteLp(id);
  const [isEditingLp, setIsEditingLp] = useState(false);
  const [lpTitleInput, setLpTitleInput] = useState("");
  const [lpContentInput, setLpContentInput] = useState("");
  const [lpEditError, setLpEditError] = useState("");

  const {
    data: commentsData,
    isLoading: commentsLoading,
    isError: commentsError,
  } = useGetLpComments(id, commentOrder);

  if (isLoading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  if (isError) {
    return (
      <div className="text-center p-4 text-red-500">Error fetching data</div>
    );
  }

  const lp = data?.data;
  if (!lp) {
    return <div className="text-center p-4 text-gray-500">LP not found</div>;
  }

  const normalizedUserId =
    userId != null
      ? Number.isNaN(Number(userId))
        ? null
        : Number(userId)
      : null;
  const isAuthor =
    normalizedUserId != null && Number(lp.authorId) === normalizedUserId;
  const likeCount = lp.likes?.length || 0;
  const uploadDate = new Date(lp.createdAt).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const commentList =
    commentsData?.pages.flatMap((page) => page.data.data) ?? [];

  const handleStartLpEdit = () => {
    if (!lp) return;
    setLpTitleInput(lp.title);
    setLpContentInput(lp.content);
    setLpEditError("");
    setIsEditingLp(true);
  };

  const handleCancelLpEdit = () => {
    setIsEditingLp(false);
    setLpEditError("");
  };

  const handleSubmitLpEdit = async () => {
    if (!lpTitleInput.trim()) {
      setLpEditError("LP 제목을 입력해주세요.");
      return;
    }

    if (!lpContentInput.trim()) {
      setLpEditError("LP 내용을 입력해주세요.");
      return;
    }

    try {
      await updateLpMutate({
        title: lpTitleInput.trim(),
        content: lpContentInput.trim(),
        published: lp.published,
      });
      setIsEditingLp(false);
      setLpEditError("");
    } catch {
      setLpEditError("LP 수정에 실패했습니다.");
    }
  };

  const handleStartEdit = (commentId: number, content: string) => {
    setEditingCommentId(commentId);
    setEditingContent(content);
    setEditingError("");
    setActiveMenuCommentId(null);
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditingContent("");
    setEditingError("");
  };

  const handleSubmitEdit = async (commentId: number) => {
    if (!editingContent.trim()) {
      setEditingError("댓글 내용을 입력해주세요.");
      return;
    }

    try {
      await updateCommentMutate({ commentId, content: editingContent });
      handleCancelEdit();
    } catch {
      setEditingError("댓글 수정에 실패했습니다.");
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    setActiveMenuCommentId(null);

    const shouldDelete = window.confirm("댓글을 삭제하시겠습니까?");
    if (!shouldDelete) {
      return;
    }

    try {
      await deleteCommentMutate({ commentId });

      if (editingCommentId === commentId) {
        handleCancelEdit();
      }
    } catch {
      alert("댓글 삭제에 실패했습니다.");
    }
  };

  const handleDeleteLp = async () => {
    const shouldDelete = window.confirm("LP를 삭제하시겠습니까?");
    if (!shouldDelete) {
      return;
    }

    try {
      await deleteLpMutate();
      navigate("/");
    } catch {
      alert("LP 삭제에 실패했습니다.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <div className="mb-6">
        {isEditingLp ? (
          <input
            value={lpTitleInput}
            onChange={(event) => {
              setLpTitleInput(event.target.value);
              setLpEditError("");
            }}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-3xl font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 md:text-4xl"
            placeholder="LP 제목을 입력하세요"
            maxLength={200}
          />
        ) : (
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{lp.title}</h1>
        )}
        <div className="flex items-center gap-4 text-gray-600 text-sm mt-4 md:mt-2">
          <span>업로드일: {uploadDate}</span>
          <span>좋아요: {likeCount}</span>
        </div>
      </div>

      {lp.thumbnail && (
        <div className="mb-6">
          <img
            src={lp.thumbnail}
            alt={lp.title}
            className="w-full h-auto rounded-lg shadow-lg object-cover"
          />
        </div>
      )}

      <div className="mb-6">
        {isEditingLp ? (
          <div className="flex flex-col gap-3">
            <textarea
              value={lpContentInput}
              onChange={(event) => {
                setLpContentInput(event.target.value);
                setLpEditError("");
              }}
              rows={12}
              className="w-full rounded-lg border border-gray-300 p-4 leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="LP 내용을 입력하세요"
            />
            {lpEditError && (
              <p className="text-sm text-red-500">{lpEditError}</p>
            )}
          </div>
        ) : (
          <div className="prose max-w-none">
            <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
              {lp.content}
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-3 mb-8">
        {isAuthor &&
          (isEditingLp ? (
            <>
              <button
                type="button"
                onClick={handleCancelLpEdit}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
                disabled={isUpdatingLp}
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleSubmitLpEdit}
                disabled={isUpdatingLp}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isUpdatingLp ? "저장 중..." : "저장"}
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={handleStartLpEdit}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                수정
              </button>
              <button
                type="button"
                onClick={handleDeleteLp}
                disabled={isDeletingLp}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isDeletingLp ? "삭제 중..." : "삭제"}
              </button>
            </>
          ))}
        <button
          type="button"
          className="px-4 py-2 bg-pink-500 text-white rounded-lg flex items-center gap-2"
        >
          좋아요
        </button>
      </div>

      <div className="border-t border-gray-200 pt-8">
        <h2 className="text-2xl font-bold mb-6">댓글</h2>

        <div className="flex justify-end mb-4">
          <div className="inline-flex rounded-lg border border-gray-300 overflow-hidden bg-white shadow-sm">
            <button
              onClick={() => setCommentOrder(PAGINATION_ORDER.asc)}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                commentOrder === PAGINATION_ORDER.asc
                  ? "bg-black text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              오래된순
            </button>
            <button
              onClick={() => setCommentOrder(PAGINATION_ORDER.desc)}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                commentOrder === PAGINATION_ORDER.desc
                  ? "bg-black text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              최신순
            </button>
          </div>
        </div>

        {accessToken && (
          <div className="mb-6 p-4 border border-gray-200 rounded-lg">
            <textarea
              value={commentContent}
              onChange={(e) => {
                setCommentContent(e.target.value);
                setCommentError("");
              }}
              placeholder="댓글을 입력하세요..."
              className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
            />
            {commentError && (
              <p className="mt-2 text-sm text-red-500">{commentError}</p>
            )}
            <div className="flex justify-end mt-3">
              <button
                onClick={async () => {
                  if (!commentContent.trim()) {
                    setCommentError("댓글 내용을 입력해주세요.");
                    return;
                  }
                  if (commentContent.length > 500) {
                    setCommentError("댓글은 500자 이하여야 합니다.");
                    return;
                  }

                  try {
                    if (!id) return;
                    await createCommentMutate({ content: commentContent });
                    setCommentContent("");
                    setCommentError("");
                  } catch {
                    setCommentError("댓글 작성에 실패했습니다.");
                  }
                }}
                disabled={isCreatingComment}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                {isCreatingComment ? "작성 중..." : "작성"}
              </button>
            </div>
          </div>
        )}

        {commentsLoading ? (
          <div className="text-center p-4">Loading...</div>
        ) : commentsError ? (
          <div className="text-center p-4 text-red-500">
            Error fetching comments
          </div>
        ) : (
          <>
            {commentList.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                댓글이 없습니다.
              </div>
            ) : (
              <div className="space-y-4">
                {commentList.map((comment) => {
                  const rawCommentOwnerId =
                    comment.userId ?? comment.author?.id ?? null;
                  const normalizedCommentOwnerId =
                    rawCommentOwnerId != null
                      ? Number.isNaN(Number(rawCommentOwnerId))
                        ? null
                        : Number(rawCommentOwnerId)
                      : null;
                  const isOwnComment =
                    normalizedUserId != null &&
                    normalizedCommentOwnerId === normalizedUserId;

                  return (
                    <div
                      key={comment.id}
                      className="p-4 border border-gray-200 rounded-lg"
                    >
                      <div className="flex items-start gap-3">
                        {comment.author?.avatar && (
                          <img
                            src={comment.author.avatar}
                            alt={comment.author.name}
                            className="w-10 h-10 rounded-full"
                          />
                        )}
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold">
                                  {comment.author?.name || "Unknown"}
                                </span>
                                <span className="text-sm text-gray-500">
                                  {new Date(
                                    comment.createdAt
                                  ).toLocaleDateString("ko-KR", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                              </div>
                            </div>
                            {isOwnComment && (
                              <div className="relative">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setActiveMenuCommentId((prev) =>
                                      prev === comment.id ? null : comment.id
                                    )
                                  }
                                  className="px-2 text-gray-500 hover:text-gray-800"
                                >
                                  ⋯
                                </button>
                                {activeMenuCommentId === comment.id && (
                                  <div className="absolute right-0 mt-2 w-28 rounded-md border border-gray-200 bg-white shadow-lg">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleStartEdit(
                                          comment.id,
                                          comment.content
                                        )
                                      }
                                      className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                      수정
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleDeleteComment(comment.id)
                                      }
                                      disabled={isDeletingComment}
                                      className="block w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                      삭제
                                    </button>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                          {editingCommentId === comment.id ? (
                            <>
                              <textarea
                                value={editingContent}
                                onChange={(event) => {
                                  setEditingContent(event.target.value);
                                  setEditingError("");
                                }}
                                rows={4}
                                className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                maxLength={500}
                                disabled={isUpdatingComment}
                              />
                              {editingError && (
                                <p className="mt-2 text-sm text-red-500">
                                  {editingError}
                                </p>
                              )}
                              <div className="mt-3 flex justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={handleCancelEdit}
                                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
                                  disabled={isUpdatingComment}
                                >
                                  취소
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleSubmitEdit(comment.id)}
                                  className="rounded-lg bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
                                  disabled={isUpdatingComment}
                                >
                                  {isUpdatingComment ? "저장 중..." : "저장"}
                                </button>
                              </div>
                            </>
                          ) : (
                            <p className="text-gray-800 whitespace-pre-wrap">
                              {comment.content}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default LpDetail;
