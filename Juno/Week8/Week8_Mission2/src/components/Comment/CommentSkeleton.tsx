const CommentSkeleton = () => {
  return (
    <div className="animate-pulse flex items-center space-x-2">
      <div className="w-11 h-11 bg-gray-500 rounded-full"></div>
      <div className="flex flex-col justify-center space-y-2">
        <div className="w-10 h-4 bg-gray-400"></div>
        <div className="w-30 h-4 bg-gray-400"></div>
      </div>
    </div>
  );
};

export default CommentSkeleton;
