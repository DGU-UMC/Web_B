import { useState } from "react";
import { PAGINATION_ORDER } from "../enums/common";
import LpListSection from "../components/LpListSection";
import useDebounce from "../hooks/useDebounce";
import { SEARCH_DEBOUNCE_DELAY } from "../constants/delay";

function HomePage() {
  const [sort, setSort] = useState<PAGINATION_ORDER>(PAGINATION_ORDER.desc);
  const [search, setSearch] = useState("");
  const debouncedValue = useDebounce(search, SEARCH_DEBOUNCE_DELAY);

  return (
    <>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border-box p-2 border rounded-lg"
        placeholder="검색..."
      />
      <div className="mt-2 space-x-2">
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
      <LpListSection search={debouncedValue} order={sort} limit={15} />
    </>
  );
}

export default HomePage;
