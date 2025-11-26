import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import useGetInfiniteLpList from "../hooks/queries/useGetInfiniteLpList";
import LpCard from "./LpCard/LpCard";
import LpCardSkeletonList from "./LpCard/LpCardSkeletonList";
import { SEARCH_DEBOUNCE_DELAY } from "../constants/delay";
import type { PAGINATION_ORDER } from "../enums/common";

interface LpListSectionProps {
  search: string;
  order: PAGINATION_ORDER;
  limit?: number;
}

const LpListSection = ({ search, order, limit = 15 }: LpListSectionProps) => {
  const { ref, inView } = useInView({ threshold: 0 });

  const {
    data: lps,
    isFetching,
    hasNextPage,
    isPending,
    isError,
    fetchNextPage,
  } = useGetInfiniteLpList(limit, search, SEARCH_DEBOUNCE_DELAY, order);

  useEffect(() => {
    if (inView && !isFetching && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, isFetching, hasNextPage, fetchNextPage]);

  if (isPending) return <div className="mt-15">Loading...</div>;
  if (isError) return <div className="mt-15">Error!</div>;

  return (
    <div className="flex w-full justify-center">
      <div className="mt-2 grid gap-16 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {lps?.pages
          ?.map((page) => page.data.data)
          ?.flat()
          ?.map((lp) => (
            <LpCard key={lp.id} lp={lp} />
          ))}
        {isFetching && <LpCardSkeletonList count={limit} />}
      </div>
      <div ref={ref} className="h-2"></div>
    </div>
  );
};

export default LpListSection;
