import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import useGetLpDetail from "../hooks/queries/useGetLpDetail";
import type { LpDetailData } from "../types/lp";
import useGetMyInfo from "../hooks/queries/useGetMyInfo";
import { Heart } from "lucide-react";
import usePostLike from "../hooks/mutations/usePostLike";
import useDeleteLike from "../hooks/mutations/useDeleteLike";

const LpDetailPage = () => {
  const { lpId } = useParams<{ lpId: string }>();
  const { accessToken } = useAuth();

  const { mutate: likeMutate } = usePostLike();
  const { mutate: disLikeMutate } = useDeleteLike();

  const {
    data: lp,
    isPending,
    isError,
  } = useGetLpDetail({ lpId: Number(lpId) });

  const { data: me } = useGetMyInfo(accessToken);

  const handleLikeLp = () => {
    likeMutate({ lpId: Number(lpId) });
  };

  const isLiked = lp?.data.likes
    .map((like) => like.userId)
    .includes(me?.data.id as number);

  const handleDislikeLp = () => {
    disLikeMutate({ lpId: Number(lpId) });
  };

  const currentUserId = 5;

  if (isPending)
    return <div className="mt-20 text-center items-center">로딩중...</div>;
  if (isError)
    return <div className="mt-20 text-center items-center">에러 발생!</div>;

  const lpDetail: LpDetailData = lp.data;

  const authorName = lpDetail.author?.name || "알 수 없음";
  const authorId = lpDetail.authorId;

  const isAuthor = accessToken && authorId === currentUserId;

  const date = new Date(lpDetail.createdAt).toLocaleDateString("ko-KR");

  // const userLiked = lpDetail.likes.some(
  //   (like) => like.userId === currentUserId
  // );
  // const likeCount = lpDetail.likes.length;

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
              <button className="hover:text-yellow-400 p-1" title="수정">
                수정
              </button>
              <button className="hover:text-red-500 p-1" title="삭제">
                삭제
              </button>
            </>
          )}
        </div>
      </div>

      <h1 className="text-4xl font-bold text-white mb-10 text-center">
        {lpDetail.title}
      </h1>

      <div className="flex justify-center mb-12">
        <div className="relative w-[300px] h-[300px] rounded-full overflow-hidden  ">
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
        {lpDetail.tags.map((tag, index) => (
          <span
            key={index}
            className="px-3 py-1 bg-gray-700 text-pink-400 rounded-full text-sm font-medium hover:bg-gray-600 transition duration-150 cursor-pointer"
          >
            #{tag.name}
          </span>
        ))}
      </div>

      <div className="flex justify-center items-center space-x-3 mt-10">
        <button onClick={isLiked ? handleDislikeLp : handleLikeLp}>
          <Heart
            color={isLiked ? "red" : "black"}
            fill={isLiked ? "red" : "none"}
          />
        </button>
      </div>
    </div>
  );
};

export default LpDetailPage;
