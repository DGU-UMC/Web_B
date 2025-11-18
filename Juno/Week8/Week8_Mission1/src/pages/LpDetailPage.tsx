import { useParams } from "react-router-dom";
import useGetLpDetail from "../hooks/queries/useGetLpDetail";
import useGetInfiniteComments from "../hooks/queries/useGetInfiniteComments";
import { useEffect, useState } from "react";
import { PAGINATION_ORDER } from "../enums/common";
import { useInView } from "react-intersection-observer";
import CommentCard from "../components/Comment/CommentCard";
import CommentSkeletonList from "../components/Comment/CommentSkeletonList";
import { Heart } from "lucide-react";
import useGetMyInfo from "../hooks/queries/useGetMyInfo";
import { useAuth } from "../context/AuthContext";
import usePostLike from "../hooks/mutations/usePostLike";
import useDeleteLike from "../hooks/mutations/useDeleteLike";
import usePostLpComment from "../hooks/mutations/usePostLpComment";
import usePatchLp from "../hooks/mutations/usePatchLp";

const LpDetailPage = () => {
  // LP 상세 정보 수정 로직
  const [isPatching, setIsPatching] = useState(false);
  const [patchedTitle, setPatchedTitle] = useState("");
  const [patchedContent, setPatchedContent] = useState("");
  const { mutate: patchMutate } = usePatchLp();

  const [sort, setSort] = useState<PAGINATION_ORDER>(PAGINATION_ORDER.desc);
  const [comment, setComment] = useState("");
  const { lpId } = useParams();
  const { accessToken } = useAuth();

  const {
    data: detailData,
    isPending: isDetailPending,
    isError: isDetailError,
  } = useGetLpDetail(parseInt(lpId as string, 10));

  const {
    data: commentsData,
    isPending: isCommentsPending,
    isError: isCommentsError,
    isFetching,
    hasNextPage,
    fetchNextPage,
  } = useGetInfiniteComments(parseInt(lpId as string, 10), 10, sort);

  const { data: MyData } = useGetMyInfo(accessToken);
  const { mutate: likeMutate } = usePostLike();
  const { mutate: dislikeMutate } = useDeleteLike();
  const isLiked = detailData?.likes
    .map((like) => like.userId)
    .includes(MyData?.data.id as number);

  const { mutate: commentMutate } = usePostLpComment(
    parseInt(lpId as string, 10),
    sort
  );

  const { ref, inView } = useInView({ threshold: 0 });

  useEffect(() => {
    if (inView && !isFetching && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, isFetching, hasNextPage, fetchNextPage]);

  const handleLikeLp = () => {
    likeMutate(parseInt(lpId as string, 10));
  };

  const handleDislikeLp = () => {
    dislikeMutate(parseInt(lpId as string, 10));
  };

  const handlePostComment = () => {
    commentMutate(comment);
    setComment("");
  };

  if (isDetailPending || isCommentsPending) {
    return <div className="mt-15">Loading...</div>;
  }

  if (isDetailError || isCommentsError) {
    return <div className="mt-15">Error!</div>;
  }

  return (
    <>
      <div className="space-y-2">
        <div className="w-30 overflow-hidden">
          <img
            src={detailData.thumbnail}
            alt={`${detailData.title}의 썸네일`}
          />
        </div>
        <h1 className={`${isPatching ? "hidden" : ""}`}>{detailData.title}</h1>
        <input
          type="text"
          name="content"
          value={patchedTitle}
          onChange={(e) => setPatchedTitle(e.target.value)}
          className={`flex-1 px-2 border rounded-lg ${
            isPatching ? "" : "hidden"
          }`}
        />
        <p>{detailData.createdAt.slice(0, 10)}</p>
        <p className={`${isPatching ? "hidden" : ""}`}>{detailData.content}</p>
        <input
          type="text"
          name="content"
          value={patchedContent}
          onChange={(e) => setPatchedContent(e.target.value)}
          className={`flex-1 px-2 border rounded-lg ${
            isPatching ? "" : "hidden"
          }`}
        />
        <div className="flex space-x-4">
          <button onClick={isLiked ? handleDislikeLp : handleLikeLp}>
            <Heart
              color={isLiked ? "red" : "black"}
              fill={isLiked ? "red" : "transparent"}
            />
          </button>
          <button
            onClick={() => setIsPatching(true)}
            disabled={MyData?.data.id !== detailData.authorId}
            className={`cursor-pointer w-20 box-border px-4 py-2 bg-gray-950 text-gray-50 rounded-xl disabled:bg-gray-300 disabled:cursor-not-allowed ${
              isPatching ? "hidden" : ""
            }`}
          >
            수정
          </button>
          <button
            onClick={() => {
              setIsPatching(false);
              patchMutate({
                id: detailData.id,
                title: patchedTitle,
                content: patchedContent,
                thumbnail: detailData.thumbnail,
                tags: detailData.tags,
                published: detailData.published,
              });
            }}
            className={`cursor-pointer w-20 box-border px-4 py-2 bg-gray-950 text-gray-50 rounded-xl ${
              isPatching ? "" : "hidden"
            }`}
          >
            완료
          </button>
        </div>
      </div>
      <div className="w-full h-px bg-black my-10"></div>
      <div className="flex flex-col space-y-2">
        <h1 className="font-extrabold text-xl">댓글</h1>
        <div className="space-x-2">
          <button
            disabled={sort === PAGINATION_ORDER.desc}
            className="cursor-pointer px-4 py-2 border border-black rounded-xl disabled:bg-gray-900 disabled:text-gray-100"
            onClick={() => setSort(PAGINATION_ORDER.desc)}
          >
            최신순
          </button>
          <button
            disabled={sort === PAGINATION_ORDER.asc}
            className="cursor-pointer px-4 py-2 border border-black rounded-xl disabled:bg-gray-900 disabled:text-gray-100"
            onClick={() => setSort(PAGINATION_ORDER.asc)}
          >
            오래된순
          </button>
        </div>
        <div className="space-x-2">
          <input
            type="text"
            name="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="pl-4 pr-8 py-2 border border-gray-950 rounded-xl"
            placeholder="댓글을 입력해주세요."
          />
          <button
            className="cursor-pointer px-4 py-2 bg-gray-950 text-gray-50 rounded-xl disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={comment.length === 0}
            onClick={() => handlePostComment()}
          >
            작성
          </button>
        </div>
        <div className="flex flex-col space-y-2">
          {commentsData.pages
            .map((page) => page.data.data)
            .flat()
            .map((comment) => (
              <CommentCard key={comment.id} comment={comment} />
            ))}
          {isFetching && <CommentSkeletonList count={10} />}
        </div>
      </div>
      <div ref={ref} className="h-2"></div>
    </>
  );
};

export default LpDetailPage;
