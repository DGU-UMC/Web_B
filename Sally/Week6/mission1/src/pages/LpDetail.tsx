import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import useGetLpDetail from "../hooks/queries/useGetLpDetail";
import useGetLpComments from "../hooks/queries/useGetLpComments";
import { useAuth } from "../context/AuthContext";
import { PAGINATION_ORDER } from "../enum/common";
import { QUERY_KEY } from "../constants/key";
import { createComment } from "../apis/lp";

const LpDetail = () => {
  const { id } = useParams();
  const { data, isLoading, isError } = useGetLpDetail(id);
  const { accessToken } = useAuth();
  const [commentOrder, setCommentOrder] = useState<PAGINATION_ORDER>(
    PAGINATION_ORDER.desc
  );
  const [commentContent, setCommentContent] = useState("");
  const [commentError, setCommentError] = useState("");
  const queryClient = useQueryClient();

  const {
    data: commentsData,
    isLoading: commentsLoading,
    isError: commentsError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
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

  const isAuthor = accessToken && lp.authorId;
  const likeCount = lp.likes?.length || 0;
  const uploadDate = new Date(lp.createdAt).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{lp.title}</h1>
        <div className="flex items-center gap-4 text-gray-600 text-sm">
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
        <div className="prose max-w-none">
          <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
            {lp.content}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-8">
        {isAuthor && (
          <>
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg ">
              수정
            </button>
            <button className="px-4 py-2 bg-red-500 text-white rounded-lg">
              삭제
            </button>
          </>
        )}
        <button className="px-4 py-2 bg-pink-500 text-white rounded-lg flex items-center gap-2">
          좋아요
        </button>
      </div>

      {/* 댓글 섹션 */}
      <div className="border-t border-gray-200 pt-8">
        <h2 className="text-2xl font-bold mb-6">댓글</h2>

        {/* 댓글 정렬 */}
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

        {/* 댓글 작성란 */}
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
                    await createComment(id, { content: commentContent });
                    setCommentContent("");
                    setCommentError("");
                    // 댓글 목록 새로고침
                    queryClient.invalidateQueries({
                      queryKey: [QUERY_KEY.lpComments, id],
                    });
                  } catch {
                    setCommentError("댓글 작성에 실패했습니다.");
                  }
                }}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                작성
              </button>
            </div>
          </div>
        )}

        {/* 댓글 목록 */}
        {commentsLoading ? (
          <div className="text-center p-4">Loading...</div>
        ) : commentsError ? (
          <div className="text-center p-4 text-red-500">
            Error fetching comments
          </div>
        ) : (
          <>
            {commentsData?.pages.flatMap((page) => page.data.data).length ===
            0 ? (
              <div className="text-center py-8 text-gray-500">
                댓글이 없습니다.
              </div>
            ) : (
              <div className="space-y-4">
                {commentsData?.pages
                  .flatMap((page) => page.data.data)
                  .map((comment) => (
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
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold">
                              {comment.author?.name || "Unknown"}
                            </span>
                            <span className="text-sm text-gray-500">
                              {new Date(comment.createdAt).toLocaleDateString(
                                "ko-KR",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </span>
                          </div>
                          <p className="text-gray-800 whitespace-pre-wrap">
                            {comment.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}

            {/* 더 보기 버튼 */}
            {hasNextPage && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isFetchingNextPage ? "Loading..." : "더 보기"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default LpDetail;
