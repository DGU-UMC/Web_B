import { useEffect, useState } from "react";
import { PAGINATION_ORDER } from "../enums/common";
import LpCard from "../components/LpCard/LpCard";
import useGetInfiniteLpList from "../hooks/queries/useGetInfiniteLpList";
import { useInView } from "react-intersection-observer";
import LpCardSkeletonList from "../components/LpCard/LpCardSkeletonList";

function HomePage() {
  const [sort, setSort] = useState<PAGINATION_ORDER>(PAGINATION_ORDER.desc);
  const [search, setSearch] = useState("");
  // const { data, isPending, isError } = useGetLpList({ order: sort });
  const {
    data: lps,
    isFetching,
    hasNextPage,
    isPending,
    isError,
    fetchNextPage,
  } = useGetInfiniteLpList(15, search, sort);

  // ref: 특정 HTML 요소를 감시한다.
  // inView: 감시하는 요소가 화면에 보이면 true, 안 보이면 false
  const { ref, inView } = useInView({ threshold: 0 });

  useEffect(() => {
    if (inView && !isFetching && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, isFetching, hasNextPage, fetchNextPage]);

  if (isPending) {
    return <div className="mt-15">Loading...</div>;
  }

  if (isError) {
    return <div className="mt-15">Error!</div>;
  }

  return (
    <div className="p-6">
      <div className="space-x-2">
        <button
          disabled={sort === PAGINATION_ORDER.desc}
          className="cursor-pointer px-4 py-2 border border-black rounded-xl disabled:bg-gray-900 disabled:text-gray-100"
          onClick={() => setSort(PAGINATION_ORDER.desc)}
        >
          최신순
        </button>
        <button
          disabled={sort === PAGINATION_ORDER.asc}
          className="cursor-pointer px-4 py-2 border border-black rounded-xl disabled:bg-gray-900 disabled:text-gray-100"
          onClick={() => setSort(PAGINATION_ORDER.asc)}
        >
          오래된순
        </button>
      </div>
      <div className="flex w-full justify-center">
        <div className="mt-2 grid gap-16 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {lps?.pages
            ?.map((page) => page.data.data)
            ?.flat() // [[1, 2], [3, 4]].flat() -> [1, 2, 3, 4]
            ?.map((lp) => (
              <LpCard key={lp.id} lp={lp} />
            ))}
          {isFetching && <LpCardSkeletonList count={15} />}
        </div>
      </div>
      <div ref={ref} className="h-2"></div>
    </div>
  );
}

export default HomePage;
