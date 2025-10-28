export const LoadingSpinner = () => {
  return (
    <div
      className="animate-spin rounded-full size-12 border-6 border-t-transparent border-fuchsia-300"
      role="status"
    >
      <span className="sr-only">로딩중...</span>
    </div>
  );
};

export default LoadingSpinner;
