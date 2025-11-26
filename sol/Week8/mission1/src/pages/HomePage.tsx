import { useEffect, useState } from "react";
import useGetInfiniteLpList from "../hooks/queries/useGetInfiniteLpList";
import { useInView } from "react-intersection-observer";
import LpCard from "../components/LpCard/LpCard";
import LpCardSkeletonList from "../components/LpCard/LpCardSkeletonList";
import useDebounce from "../hooks/useDebounce";
import useThrottle from "../hooks/useThrottle";

const HomePage = () => {
  const [search, setSearch] = useState("");
  const debouncedValue = useDebounce(search, 500);

  const {
    data: lps,
    isFetching,
    hasNextPage,
    isPending,
    fetchNextPage,
    isError,
  } = useGetInfiniteLpList(10, debouncedValue, "desc");

  const { ref, inView } = useInView({ threshold: 0 });
  const throttledInView = useThrottle(inView, 500);

  useEffect(() => {
    if (throttledInView) {
      !isFetching && hasNextPage && fetchNextPage();
    }
  }, [throttledInView, isFetching, hasNextPage, fetchNextPage]);

  if (isPending)
    return <div className="mt-20 items-center text-center">로딩중..</div>;
  if (isError)
    return <div className="mt-20 items-center text-center">에러 발생!</div>;

  return (
    <div className="container mx-auto px-4 mt-20">
      <input
        value={search}
        className="border p-6 rounded-md"
        onChange={(e) => setSearch(e.target.value)}
        placeholder="검색어를 입력하세요"
      />
      <div
        className={
          "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-5"
        }
      >
        {lps?.pages
          ?.map((page) => page.data.data)
          ?.flat()
          ?.map((lp) => (
            <LpCard key={lp.id} lp={lp} />
          ))}
        {isFetching && <LpCardSkeletonList count={20} />}
      </div>
      <div ref={ref} className=""></div>
    </div>
  );
};

export default HomePage;
