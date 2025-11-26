import { useInfiniteQuery } from "@tanstack/react-query";
import { getLpList } from "../../apis/lp";
import type { PAGINATION_ORDER } from "../../enums/common";
import { QUERY_KEY } from "../../constants/key";
import type { ResponseLpListDto } from "../../types/lp";

function useGetInfiniteLpList(
  limit: number,
  search: string,
  debouncedQuery: number,
  order: PAGINATION_ORDER
) {
  return useInfiniteQuery({
    queryFn: ({ pageParam }) =>
      getLpList({ cursor: pageParam, limit, search, order }),
    queryKey: [QUERY_KEY.lps, search, debouncedQuery, order],
    // enabled: search !== "",
    initialPageParam: 0,
    getNextPageParam: (
      lastPage: ResponseLpListDto
      // allPages: ResponseLpListDto[]
    ) => {
      //   console.log(lastPage, allPages);
      return lastPage.data.hasNext ? lastPage.data.nextCursor : undefined;
    },
    staleTime: 1000 * 60 * 5, // 5분 동안 fresh
    // cacheTime: 1000 * 60 * 10, // 10분 동안 캐시 유지
  });
}

export default useGetInfiniteLpList;
