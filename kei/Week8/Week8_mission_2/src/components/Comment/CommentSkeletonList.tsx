import CommentSkeleton from "./CommentSkeleton";

export default function CommentSkeletonList({ count = 8 }: { count?: number }) {
  return (
    <div className="mt-3">
      {Array.from({ length: count }).map((_, i) => (
        <CommentSkeleton key={i} />
      ))}
    </div>
  );
}