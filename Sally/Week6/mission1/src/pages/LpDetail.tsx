import { useParams } from "react-router-dom";
import useGetLpDetail from "../hooks/queries/useGetLpDetail";
import { useAuth } from "../context/AuthContext";

const LpDetail = () => {
  const { id } = useParams();
  const { data, isLoading, isError } = useGetLpDetail(id);
  const { accessToken } = useAuth();

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

      <div className="flex flex-wrap gap-3">
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
    </div>
  );
};

export default LpDetail;
