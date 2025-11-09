// import { useState } from "react";
import useGetLpList from "../hooks/queries/useGetLpList";
import { Link } from "react-router-dom";

interface LpItem {
  id: number;
  title: string;
  thumbnail: string | null;
}

const HomePage = () => {
  // const [search, setSearch] = useState("");
  const { data, isPending, isError } = useGetLpList({});

  if (isPending) return <div className="mt-20">로딩중...</div>;
  if (isError) return <div className="mt-20">에러 발생!</div>;

  const lpList: LpItem[] = data?.data.data || [];

  // return (
  //   <div className="mt-20">
  //     {/* <input
  //       value={search}
  //       type="text"
  //       placeholder="검색"
  //       onChange={(e) => setSearch(e.target.value)}
  //       className="w-full md:w-2/3 p-3 text-lg border border-gray-600 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
  //     /> */}
  //     <div className="flex space-x-2">
  //       <button className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 transition duration-150">
  //         오래된순
  //       </button>
  //       <button className="px-3 py-1 bg-pink-600 text-white rounded hover:bg-pink-700 font-semibold transition duration-150">
  //         최신순
  //       </button>
  //     </div>
  //     {data?.data.data.map((lp) => (
  //       <h1>{lp.title}</h1>
  //     ))}
  //   </div>
  // );
  return (
    <div className="mt-10 p-4 md:p-8 min-h-screen">
      <h1 className="text-3xl font-bold text-black mb-6 border-b border-gray-700 pb-2">
        최신 LP 목록
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {lpList.map((lp) => (
          <Link
            key={lp.id}
            to={`/lps/${lp.id}`} // 상세 페이지 링크
            className="group cursor-pointer transform hover:scale-[1.03] transition duration-300 ease-in-out block"
          >
            <div className="relative pt-[100%] overflow-hidden rounded-md shadow-xl bg-gray-700">
              <img
                src={
                  lp.thumbnail ||
                  "https://via.placeholder.com/200/4B5563/FFFFFF?text=NO+IMAGE"
                }
                alt={lp.title}
                className="absolute inset-0 w-full h-full object-cover transition duration-500 group-hover:opacity-80"
              />
            </div>

            {/* LP 제목 */}
            <h2 className="mt-2 text-sm md:text-base font-medium text-black truncate">
              {lp.title}
            </h2>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
