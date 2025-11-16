import { Ellipsis } from "lucide-react";
import CommentModal from "./CommentModal";
import { useState } from "react";
import type { Comment } from "../../types/lp";
import useGetMyInfo from "../../hooks/queries/useGetMyInfo";
import { useAuth } from "../../context/AuthContext";
import usePatchLpComment from "../../hooks/mutations/usePatchLpComment";

interface CommentProps {
  comment: Comment;
}

const CommentCard = ({ comment }: CommentProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPatching, setIsPatching] = useState(false);
  const [patchedContent, setPatchedContent] = useState(comment.content);

  const { accessToken } = useAuth();
  const { data } = useGetMyInfo(accessToken);
  const isMyComment = comment.authorId === data?.data.id;

  const { mutate: patchMutate } = usePatchLpComment(
    comment.lpId,
    comment.id,
    patchedContent
  );

  return (
    <div className="flex justify-between w-1/2 relative">
      <div className="flex flex-1 space-x-2">
        <div className="w-12 h-12 bg-gray-500 rounded-full"></div>
        <div className="flex-1 flex flex-col justify-center">
          <p>{comment.author.name}</p>
          <p className={`${isPatching ? "hidden" : ""}`}>{comment.content}</p>
          <input
            type="text"
            name="content"
            value={patchedContent}
            onChange={(e) => setPatchedContent(e.target.value)}
            className={`flex-1 px-2 border rounded-lg ${
              isPatching ? "" : "hidden"
            }`}
          />
        </div>
      </div>
      <div className="ml-2 space-x-2">
        <button
          onClick={() => {
            patchMutate();
            setIsPatching(false);
          }}
          className={`cursor-pointer px-4 py-2 bg-gray-950 text-gray-50 rounded-xl disabled:bg-gray-400 disabled:cursor-not-allowed ${
            isPatching ? "" : "hidden"
          }`}
        >
          수정
        </button>
        <button
          disabled={!isMyComment}
          className="cursor-pointer disabled:cursor-default"
          onClick={() => setIsModalOpen((prev) => !prev)}
        >
          <Ellipsis
            className="w-5"
            color={isMyComment ? "black" : "lightgray"}
          />
        </button>
      </div>
      <CommentModal
        isOpen={isModalOpen}
        comment={comment}
        onPatchClick={() => {
          setIsPatching((prev) => !prev);
        }}
      />
    </div>
  );
};

export default CommentCard;
