interface CommentProps {
  nickname: string;
  content: string;
}

const Comment = ({ nickname, content }: CommentProps) => {
  return (
    <div className="flex items-center space-x-2">
      <div className="w-11 h-11 bg-gray-500 rounded-full"></div>
      <div className="flex flex-col justify-center">
        <p>{nickname}</p>
        <p>{content}</p>
      </div>
    </div>
  );
};

export default Comment;
