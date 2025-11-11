// import { useState } from "react";
import { useEffect, useState } from "react";
import useGetInfiniteLpList from "../hooks/queries/useGetInfiniteLpList";
// import useGetLpList from "../hooks/queries/useGetLpList";
// import { Link } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import LpCard from "../components/LpCard/LpCard";
import LpCardSkeletonList from "../components/LpCard/LpCardSkeletonList";

// interface LpItem {
//   id: number;
//   title: string;
//   thumbnail: string | null;
// }

const HomePage = () => {
  const [search, setSearch] = useState("");
  // const { data, isPending, isError } = useGetLpList({});

  const {
    data: lps,
    isFetching,
    hasNextPage,
    isPending,
    fetchNextPage,
    isError,
  } = useGetInfiniteLpList(10, search, "desc");

  const { ref, inView } = useInView({ threshold: 0 });

  useEffect(() => {
    if (inView) {
      !isFetching && hasNextPage && fetchNextPage();
    }
  }, [inView, isFetching, hasNextPage, fetchNextPage]);

  if (isPending) return <div className="mt-20">로딩중...</div>;
  if (isError) return <div className="mt-20">에러 발생!</div>;

  // const lpList: LpItem[] = data?.data.data || [];

  return (
    <div className="container mx-auto px-4 py-6">
      <input value={search} onChange={(e) => setSearch(e.target.value)} />
      <div
        className={
          "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-20"
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

  // return (
  //   <div className="mt-10 p-4 md:p-8 min-h-screen">
  //     <h1 className="text-3xl font-bold text-black mb-6 border-b border-gray-700 pb-2">
  //       최신 LP 목록
  //     </h1>
  //     <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
  //       {lpList.map((lp) => (
  //         <Link
  //           key={lp.id}
  //           to={`/lps/${lp.id}`} // 상세 페이지 링크
  //           className="group cursor-pointer transform hover:scale-[1.03] transition duration-300 ease-in-out block"
  //         >
  //           <div className="relative pt-[100%] overflow-hidden rounded-md shadow-xl bg-gray-700">
  //             <img
  //               src={
  //                 lp.thumbnail ||
  //                 "https://via.placeholder.com/200/4B5563/FFFFFF?text=NO+IMAGE"
  //               }
  //               alt={lp.title}
  //               className="absolute inset-0 w-full h-full object-cover transition duration-500 group-hover:opacity-80"
  //             />
  //           </div>

  //           <h2 className="mt-2 text-sm md:text-base font-medium text-black truncate">
  //             {lp.title}
  //           </h2>
  //         </Link>
  //       ))}
  //     </div>
  //   </div>
  // );
};

export default HomePage;
