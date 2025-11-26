import { useInfiniteQuery } from "@tanstack/react-query";
import { getLpComments } from "../../apis/comments";
import type { PAGINATION_ORDER } from "../../enums/common";

export default function useGetInfiniteLpComments(
  lpId: number,
  order: PAGINATION_ORDER,
  limit = 10
) {
  return useInfiniteQuery({
    queryKey: ["lpComments", lpId, order],
    queryFn: ({ pageParam }) =>
      getLpComments(lpId, { cursor: pageParam, limit, order }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.data.hasNext ? lastPage.data.nextCursor : undefined,
  });
}