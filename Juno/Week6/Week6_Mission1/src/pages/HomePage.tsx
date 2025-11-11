import { useState } from "react";
import useGetLpList from "../hooks/queries/useGetLpList";
import { PAGINATION_ORDER } from "../enums/common";
import LpCard from "../components/LpCard";

function HomePage() {
  const [sort, setSort] = useState<PAGINATION_ORDER>(PAGINATION_ORDER.desc);
  const { data, isPending, isError } = useGetLpList({ order: sort });

  if (isPending) {
    return <div className="mt-15">Loading...</div>;
  }

  if (isError) {
    return <div className="mt-15">Error!</div>;
  }

  console.log(data?.map((lp) => lp.id));
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
        <div className="mt-2 grid gap-16 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {data?.map((lp) => (
            <LpCard
              key={lp.id}
              id={lp.id}
              title={lp.title}
              createdAt={lp.createdAt}
              thumnail={lp.thumnail}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
