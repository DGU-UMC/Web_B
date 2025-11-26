import { useQuery } from "@tanstack/react-query";
import { getLpDetail } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";

function useGetLpDetail(lpid: number) {
  return useQuery({
    queryKey: [QUERY_KEY.lps, lpid],
    queryFn: () => getLpDetail(lpid),
    staleTime: 5 * 60 * 1_000, // 5분
    gcTime: 10 * 60 * 1_000, // 10분
    select: (data) => data.data,
  });
}

export default useGetLpDetail;
