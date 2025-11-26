import useDeleteLpComment from "../../hooks/mutations/useDeleteLpComment";
import type { Comment } from "../../types/lp";

interface CommentModalProps {
  isOpen: boolean;
  comment: Comment;
  onPatchClick: () => void;
}

const CommentModal = ({ isOpen, comment, onPatchClick }: CommentModalProps) => {
  const { mutate: deleteMutate } = useDeleteLpComment(comment.lpId, comment.id);

  return (
    <div
      className={`absolute -right-32 w-30 h-24 box-border rounded-lg overflow-hidden bg-gray-50 shadow-md flex flex-col ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <button
        onClick={onPatchClick}
        className="flex-1 cursor-pointer hover:bg-gray-200"
      >
        수정
      </button>
      <button
        onClick={() => deleteMutate()}
        className="flex-1 cursor-pointer hover:bg-gray-200"
      >
        삭제
      </button>
    </div>
  );
};

export default CommentModal;
