import { useInfiniteQuery } from "@tanstack/react-query";
import { getLpList } from "../../apis/lp";
import { PAGINATION_ORDER } from "../../enums/common";
import { QUERY_KEY } from "../../constants/key";

function useGetInfiniteLpList(
    limit: number,
    search: string, // 여기로 디바운스된 값이 들어옴
    order: PAGINATION_ORDER,
) {
    const trimmedSearch = search.trim();
    const isEmptySearch = trimmedSearch.length === 0;

    return useInfiniteQuery({
        queryFn:({ pageParam }) => 
            getLpList({cursor: pageParam, limit, search: trimmedSearch, order}),
        queryKey: [QUERY_KEY.lps, trimmedSearch, order, limit],
        initialPageParam: 0,
        getNextPageParam: (lastPage) => {
            //console.log(lastPage, allPages);
            return lastPage.data.hasNext ? lastPage.data.nextCursor: undefined;
        },
        enabled: !isEmptySearch,
        staleTime: 30 * 1000,
        gcTime: 5 * 60 * 1000,
    });
}

export default useGetInfiniteLpList;