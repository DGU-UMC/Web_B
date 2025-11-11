import { useQuery } from "@tanstack/react-query";
import { QUERY_KEY } from "../../constants/key";
import { getLpDetail } from "../../apis/lp";

function useGetLpDetail(lpId: string | undefined) {
  return useQuery({
    queryKey: [QUERY_KEY.lp, lpId],
    queryFn: () => {
      if (!lpId) throw new Error("LP ID is required");
      return getLpDetail(lpId);
    },
    enabled: !!lpId, // lpId가 있을 때만 쿼리 실행

    // 데이터가 신선하다고 간주하는 시간
    staleTime: 1000 * 60 * 5, //5분

    // 사용되지 않는 (비활성상태) 쿼리 데이터가 캐시에 남아있는 시간
    gcTime: 1000 * 60 * 10, //10분
  });
}

export default useGetLpDetail;

