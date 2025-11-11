import { useQuery } from "@tanstack/react-query";
import type { PaginationDto } from "../../types/common";
import { QUERY_KEY } from "../../constants/key";
import { getLpList } from "../../apis/lp";

function useGetLpList(params: PaginationDto) {
  const sort = params.order || null;
  
  return useQuery({
    queryKey: [QUERY_KEY.lps, sort, params],
    queryFn: () => getLpList(params),

    // 데이터가 신선하다고 간주하는 시간
    staleTime: 1000 * 60 * 5, //5분

    // 사용되지 않는 (비활성상태) 쿼리 데이터가 캐시에 남아있는 시간
    gcTime: 1000 * 60 * 10, //10분

    // 조건에 따라 쿼리를 실행 여부 제어
    // enabled: Boolean(serch)
    // refetchinterval: 1000 * 60,
  });
}

export default useGetLpList;
