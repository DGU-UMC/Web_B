import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Heart } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import useGetLpDetail from "../hooks/queries/useGetLpDetail";
import type { Comment, LpDetailData } from "../types/lp";
import useGetMyInfo from "../hooks/queries/useGetMyInfo";
import usePostLike from "../hooks/mutations/usePostLike";
import useDeleteLike from "../hooks/mutations/useDeleteLike";
import useGetComments from "../hooks/queries/useGetComments";
import useCreateComment from "../hooks/mutations/useCreateComment";
import useUpdateComment from "../hooks/mutations/useUpdateComment";
import useDeleteComment from "../hooks/mutations/useDeleteComment";
import useUpdateLp from "../hooks/mutations/useUpdateLp";
import useDeleteLp from "../hooks/mutations/useDeleteLp";

const LpDetailPage = () => {
  const { lpId } = useParams<{ lpId: string }>();
  const numericLpId = Number(lpId);
  const { accessToken } = useAuth();
  const navigate = useNavigate();

  const { mutate: likeMutate } = usePostLike();
  const { mutate: disLikeMutate } = useDeleteLike();

  const {
    data: lp,
    isPending,
    isError,
  } = useGetLpDetail({ lpId: numericLpId });

  const { data: me } = useGetMyInfo(accessToken);
  const currentUserId = me?.data?.id;

  const {
    data: comments,
    isPending: isCommentsLoading,
    isError: isCommentsError,
  } = useGetComments(numericLpId);

  const { mutateAsync: createComment, isPending: isCreatingComment } =
    useCreateComment(numericLpId);
  const { mutateAsync: updateComment, isPending: isUpdatingComment } =
    useUpdateComment(numericLpId);
  const { mutateAsync: deleteComment, isPending: isDeletingComment } =
    useDeleteComment(numericLpId);

  const { mutateAsync: updateLp, isPending: isUpdatingLp } =
    useUpdateLp(numericLpId);
  const { mutateAsync: deleteLp, isPending: isDeletingLp } =
    useDeleteLp(numericLpId);

  const [commentInput, setCommentInput] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState("");
  const [openedMenuId, setOpenedMenuId] = useState<number | null>(null);

  const [isEditMode, setIsEditMode] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editTags, setEditTags] = useState<string[]>([]);
  const [editTagInput, setEditTagInput] = useState("");

  const handleEnterEdit = (detail: LpDetailData) => {
    setIsEditMode(true);
    setEditTitle(detail.title);
    setEditContent(detail.content);
    setEditTags(detail.tags?.map((t) => t.name) ?? []);
  };

  const handleLikeLp = () => {
    likeMutate({ lpId: numericLpId });
  };

  const handleDislikeLp = () => {
    disLikeMutate({ lpId: numericLpId });
  };

  if (isPending) {
    return <div className="mt-20 text-center items-center">로딩중...</div>;
  }
  if (isError || !lp || !lp.data) {
    return <div className="mt-20 text-center items-center">에러 발생!</div>;
  }

  const lpDetail: LpDetailData = lp.data;

  const authorName = lpDetail.author?.name || "알 수 없음";
  const authorId = lpDetail.authorId;

  const isAuthor = !!accessToken && authorId === currentUserId;

  const date = new Date(lpDetail.createdAt).toLocaleDateString("ko-KR");

  const isLiked =
    lpDetail.likes
      ?.map((like) => like.userId)
      .includes((me?.data?.id as number | undefined) ?? -1) ?? false;

  const handleCommentSubmit = async () => {
    if (!commentInput.trim()) return;
    await createComment(commentInput.trim());
    setCommentInput("");
  };

  const handleStartEdit = (comment: Comment) => {
    setEditingCommentId(comment.id);
    setEditingValue(comment.content);
    setOpenedMenuId(null);
  };

  const handleEditSubmit = async (commentId: number) => {
    await updateComment({ commentId, content: editingValue });
    setEditingCommentId(null);
    setEditingValue("");
  };

  const handleDeleteComment = async (commentId: number) => {
    await deleteComment(commentId);
    setOpenedMenuId(null);
  };

  const handleAddEditTag = () => {
    const next = editTagInput.trim();
    if (!next) return;
    if (editTags.includes(next)) {
      setEditTagInput("");
      return;
    }
    setEditTags((prev) => [...prev, next]);
    setEditTagInput("");
  };

  const handleUpdateLp = async () => {
    await updateLp({
      lpId: numericLpId,
      title: editTitle,
      content: editContent,
      tags: editTags,
      thumbnail: lpDetail.thumbnail,
      published: lpDetail.published,
    });
    setIsEditMode(false);
  };

  const handleDeleteLp = async () => {
    const ok = window.confirm("이 LP를 삭제할까요?");
    if (!ok) return;
    await deleteLp();
    navigate("/");
  };

  return (
    <div className="mt-20 max-w-4xl mx-auto bg-gray-600 p-8 pt-4 min-h-screen">
      <div className="flex justify-between items-center mb-10 text-white">
        <div className="flex items-center space-x-2 text-lg">
          <span className="font-bold text-pink-500">{authorName}</span>
        </div>

        <div className="flex items-center space-x-3 text-sm text-gray-400">
          <span>{date}</span>

          {isAuthor && (
            <>
              <button
                className="hover:text-yellow-400 p-1"
                title="수정"
                onClick={() => handleEnterEdit(lpDetail)}
              >
                수정
              </button>
              <button
                className="hover:text-red-500 p-1"
                title="삭제"
                onClick={handleDeleteLp}
                disabled={isDeletingLp}
              >
                {isDeletingLp ? "삭제 중..." : "삭제"}
              </button>
            </>
          )}
        </div>
      </div>

      {isEditMode ? (
        <div className="space-y-3 bg-gray-700 p-4 rounded-md text-white">
          <input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full text-black rounded-md px-3 py-2"
            placeholder="제목"
          />
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full text-black rounded-md px-3 py-2 h-28"
            placeholder="내용"
          />
          <div className="flex items-center gap-2">
            <input
              value={editTagInput}
              onChange={(e) => setEditTagInput(e.target.value)}
              className="flex-1 text-black rounded-md px-3 py-2"
              placeholder="태그 입력 후 엔터"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddEditTag();
                }
              }}
            />
            <button
              className="px-3 py-2 bg-gray-500 rounded-md"
              onClick={handleAddEditTag}
            >
              추가
            </button>
          </div>
          {editTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {editTags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-gray-800 rounded-full text-sm flex items-center gap-2"
                >
                  #{tag}
                  <button
                    className="text-red-400"
                    onClick={() =>
                      setEditTags((prev) => prev.filter((t) => t !== tag))
                    }
                  >
                    x
                  </button>
                </span>
              ))}
            </div>
          )}
          <div className="space-x-2">
            <button
              className="px-4 py-2 bg-pink-600 rounded-md"
              onClick={handleUpdateLp}
              disabled={isUpdatingLp}
            >
              {isUpdatingLp ? "저장 중..." : "저장"}
            </button>
            <button
              className="px-4 py-2 bg-gray-500 rounded-md"
              onClick={() => setIsEditMode(false)}
            >
              취소
            </button>
          </div>
        </div>
      ) : (
        <>
          <h1 className="text-4xl font-bold text-white mb-10 text-center">
            {lpDetail.title}
          </h1>

          <div className="flex justify-center mb-12">
            <div className="relative w-[300px] h-[300px] rounded-full overflow-hidden">
              <img
                src={
                  lpDetail.thumbnail ||
                  "https://via.placeholder.com/300/1F2937/FFFFFF?text=LP"
                }
                alt={`${lpDetail.title} CD`}
                className="w-full h-full object-cover"
                style={{ filter: "brightness(0.8)" }}
              />
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gray-300 rounded-full " />
            </div>
          </div>

          <p className="text-lg text-gray-300 mb-8 p-4 text-center">
            {lpDetail.content}
          </p>

          <div className="flex flex-wrap space-x-2 mb-8 justify-center">
            {(lpDetail.tags ?? []).map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-700 text-pink-400 rounded-full text-sm font-medium hover:bg-gray-600 transition duration-150 cursor-pointer"
              >
                #{tag.name}
              </span>
            ))}
          </div>
        </>
      )}

      <div className="flex justify-center items-center space-x-3 mt-10">
        <button onClick={isLiked ? handleDislikeLp : handleLikeLp}>
          <Heart
            color={isLiked ? "red" : "black"}
            fill={isLiked ? "red" : "none"}
          />
        </button>
      </div>

      <section className="mt-12 bg-gray-700 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-semibold mb-4">댓글</h2>
        {isCommentsLoading && <div>댓글 불러오는 중...</div>}
        {isCommentsError && <div>댓글을 불러오지 못했습니다.</div>}

        {accessToken && (
          <div className="mb-4">
            <textarea
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              className="w-full p-3 rounded-md text-black"
              placeholder="댓글을 입력하세요"
            />
            <button
              className="mt-2 px-4 py-2 bg-pink-500 rounded-md text-white disabled:bg-gray-400"
              disabled={isCreatingComment || !commentInput.trim()}
              onClick={handleCommentSubmit}
            >
              {isCreatingComment ? "등록 중..." : "댓글 등록"}
            </button>
          </div>
        )}

        <div className="space-y-4">
          {(Array.isArray(comments?.data?.data)
            ? comments?.data?.data
            : Array.isArray(comments?.data)
            ? (comments as any).data
            : Array.isArray((comments as any)?.data?.comments)
            ? (comments as any).data.comments
            : []
          ).map((comment: Comment) => {
            const isMine = comment.userId === currentUserId;
            const isEditing = editingCommentId === comment.id;
            return (
              <div
                key={comment.id}
                className="bg-gray-800 rounded-md p-3 relative"
              >
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1">
                    <div className="text-sm text-gray-300 mb-1">
                      {comment.author?.name ?? "익명"}
                    </div>
                    {isEditing ? (
                      <div className="space-y-2">
                        <textarea
                          value={editingValue}
                          onChange={(e) => setEditingValue(e.target.value)}
                          className="w-full p-2 rounded-md text-black"
                        />
                        <div className="space-x-2">
                          <button
                            className="px-3 py-1 bg-pink-500 rounded text-white"
                            disabled={isUpdatingComment || !editingValue.trim()}
                            onClick={() => handleEditSubmit(comment.id)}
                          >
                            {isUpdatingComment ? "수정 중..." : "수정 완료"}
                          </button>
                          <button
                            className="px-3 py-1 bg-gray-600 rounded text-white"
                            onClick={() => setEditingCommentId(null)}
                          >
                            취소
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-white">{comment.content}</p>
                    )}
                  </div>

                  {isMine && (
                    <div className="relative">
                      <button
                        className="px-2 text-xl"
                        onClick={() =>
                          setOpenedMenuId((prev) =>
                            prev === comment.id ? null : comment.id
                          )
                        }
                        aria-label="댓글 메뉴"
                      >
                        …
                      </button>
                      {openedMenuId === comment.id && (
                        <div className="absolute right-0 mt-2 bg-white text-black rounded shadow-md z-10">
                          <button
                            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                            onClick={() => handleStartEdit(comment)}
                          >
                            수정
                          </button>
                          <button
                            className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600 disabled:text-red-300"
                            disabled={isDeletingComment}
                            onClick={() => handleDeleteComment(comment.id)}
                          >
                            삭제
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default LpDetailPage;
