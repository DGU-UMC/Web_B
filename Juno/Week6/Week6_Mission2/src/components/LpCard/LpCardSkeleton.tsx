const LpCardSkeleton = () => {
  return (
    <div className="animate-pulse relative rounded-xl shadow-lg overflow-hidden flex justify-between items-center w-44 h-62">
      <div className="bg-gray-300 w-full h-40"></div>(
      <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent backdrop-blur-md flex flex-col justify-center items-center text-white p-4">
        <div className="bg-gray-400 h-4 w-3/4 rounded-sm"></div>
        <div className="bg-gray-400 h-4 w-3/4 rounded-sm"></div>
      </div>
      )
    </div>
  );
};

export default LpCardSkeleton;
