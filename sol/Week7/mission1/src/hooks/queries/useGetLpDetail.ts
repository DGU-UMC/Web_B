import { useQuery } from "@tanstack/react-query";
import { QUERY_KEY } from "../../constants/key";
import { getLpDetail } from "../../apis/lp";
import type { RequestLpDto } from "../../types/lp";

function useGetLpDetail({ lpId }: RequestLpDto) {
  return useQuery({
    queryKey: [QUERY_KEY.lps, lpId],
    queryFn: () => getLpDetail({ lpId }),

    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60,
  });
}

export default useGetLpDetail;
