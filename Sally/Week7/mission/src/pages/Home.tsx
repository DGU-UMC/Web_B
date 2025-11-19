import { useState } from "react";
import { Link } from "react-router-dom";
import useGetLpList from "../hooks/queries/useGetLpList";
import { PAGINATION_ORDER } from "../enum/common";
import CreateLpModal from "../components/CreateLpModal";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const [sortOrder, setSortOrder] = useState<PAGINATION_ORDER>(
    PAGINATION_ORDER.desc
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { accessToken } = useAuth();
  const { data, isLoading, isError } = useGetLpList({
    order: sortOrder,
  });

  if (isLoading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  if (isError) {
    return (
      <div className="text-center p-4 text-red-500">Error fetching data</div>
    );
  }

  const lps = data?.pages.flatMap((page) => page.data.data) || [];

  return (
    <div className="p-4 relative">
      <div className="flex justify-end mb-4">
        <div className="inline-flex rounded-lg border border-gray-300 overflow-hidden bg-white shadow-sm">
          <button
            onClick={() => setSortOrder(PAGINATION_ORDER.asc)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              sortOrder === PAGINATION_ORDER.asc
                ? "bg-black text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            오래된순
          </button>
          <button
            onClick={() => setSortOrder(PAGINATION_ORDER.desc)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              sortOrder === PAGINATION_ORDER.desc
                ? "bg-black text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            최신순
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {lps.length > 0 ? (
          lps.map((lp) => (
            <Link
              key={lp.id}
              to={`/lp/${lp.id}`}
              className="group relative aspect-square overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 bg-gray-200"
            >
              <img
                src={lp.thumbnail}
                alt={lp.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center py-8 text-gray-500">
            No LPs found
          </div>
        )}
      </div>

      {accessToken && (
        <button
          onClick={() => setIsModalOpen(true)}
          className="fixed bottom-8 right-8 w-14 h-14 bg-pink-500 text-white rounded-full shadow-lg flex items-center justify-center z-40"
        >
          +
        </button>
      )}

      <CreateLpModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
export default Home;
