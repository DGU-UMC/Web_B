import { useInfiniteQuery } from "@tanstack/react-query";
import type { PAGINATION_ORDER } from "../../enum/common";
import { QUERY_KEY } from "../../constants/key";
import { getLpComments } from "../../apis/lp";

function useGetLpComments(lpId: string | undefined, order: PAGINATION_ORDER) {
  return useInfiniteQuery({
    queryKey: [QUERY_KEY.lpComments, lpId, order],
    queryFn: ({ pageParam }) => {
      if (!lpId) throw new Error("LP ID is required");
      return getLpComments(lpId, {
        cursor: pageParam,
        order,
      });
    },
    enabled: !!lpId,
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) => {
      if (lastPage.hasNext && lastPage.nextCursor) {
        return lastPage.nextCursor;
      }
      return undefined;
    },

    staleTime: 1000 * 60 * 5,

    gcTime: 1000 * 60 * 10,
  });
}

export default useGetLpComments;
