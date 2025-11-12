import { useInfiniteQuery } from "@tanstack/react-query";
import type { PaginationDto } from "../../types/common";
import { QUERY_KEY } from "../../constants/key";
import { getLpList } from "../../apis/lp";

function useGetLpList(params: Omit<PaginationDto, "cursor">) {
  const sort = params.order || null;

  return useInfiniteQuery({
    queryKey: [QUERY_KEY.lps, sort],
    queryFn: ({ pageParam }) => {
      return getLpList({
        ...params,
        cursor: pageParam,
      });
    },
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) => {
      if (lastPage.hasNext && lastPage.nextCursor) {
        return lastPage.nextCursor;
      }
      return undefined;
    },

    // 데이터가 신선하다고 간주하는 시간
    staleTime: 1000 * 60 * 5, //5분

    // 사용되지 않는 (비활성상태) 쿼리 데이터가 캐시에 남아있는 시간
    gcTime: 1000 * 60 * 10, //10분
  });
}

export default useGetLpList;
