import { useInfiniteQuery } from "@tanstack/react-query";
import type { PAGINATION_ORDER } from "../../enums/common";
import { QUERY_KEY } from "../../constants/key";
import { getLpComments } from "../../apis/lp";
import type { ResponseLpCommentsDto } from "../../types/lp";

function useGetInfiniteComments(
  lpId: number,
  limit: number,
  order: PAGINATION_ORDER
) {
  return useInfiniteQuery({
    queryFn: ({ pageParam }) =>
      getLpComments({ lpId, cursor: pageParam, limit, order }),
    queryKey: [QUERY_KEY.comments, lpId, order],
    initialPageParam: 0,
    getNextPageParam: (lastPage: ResponseLpCommentsDto) => {
      return lastPage.data.hasNext ? lastPage.data.nextCursor : undefined;
    },
  });
}

export default useGetInfiniteComments;
