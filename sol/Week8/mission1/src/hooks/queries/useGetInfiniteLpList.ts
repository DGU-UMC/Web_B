import { useInfiniteQuery } from "@tanstack/react-query";
import { getLpList } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";

function useGetInfiniteLpList(
  limit: number,
  search: string,
  order: "asc" | "desc"
) {
  return useInfiniteQuery({
    queryFn: ({ pageParam }) =>
      getLpList({ cursor: pageParam, limit, search, order }),
    queryKey: [QUERY_KEY.lps, search, order],
    initialPageParam: 0,
    enabled: search !== undefined, // 검색어가 비어도 기본 목록을 불러오도록 유지
    staleTime: 1000 * 60 * 3, // 3분 동안 신선하게 유지
    gcTime: 1000 * 60 * 10, // 10분 후 캐시 정리
    getNextPageParam: (lastPage /*allPages*/) =>
      lastPage.data.hasNext ? lastPage.data.nextCursor : undefined,
  });
}

export default useGetInfiniteLpList;
