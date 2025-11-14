const CommentSkeleton = () => (
  <div className="flex items-start gap-3 py-3 animate-pulse">
    <div className="w-8 h-8 rounded-full bg-gray-300" />
    <div className="flex-1 space-y-2">
      <div className="h-4 w-1/5 bg-gray-400 rounded" />
      <div className="h-3 w-4/5 bg-gray-300 rounded" />
      <div className="h-3 w-3/5 bg-gray-300 rounded" />
    </div>
  </div>
);
export default CommentSkeleton;