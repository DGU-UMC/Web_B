function LoadingSpinner() {
  return (
    <div
      className="size-12 animate-spin rounded-full border-6 border-gray-400 border-t-transparent"
      role="status"
    >
      {/* 스크린 리더 사용자를 위한 문구 */}
      <span className="sr-only">로딩 중...</span>{" "}
    </div>
  );
}

export default LoadingSpinner;
