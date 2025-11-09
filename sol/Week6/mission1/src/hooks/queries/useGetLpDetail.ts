import { useQuery } from "@tanstack/react-query";
import { QUERY_KEY } from "../../constants/key";
import { getLpDetail } from "../../apis/lp";

function useGetLpDetail(lpId: string | undefined) {
  const numericLpId = lpId ? Number(lpId) : null;
  const isValidId = numericLpId !== null && !isNaN(numericLpId);

  return useQuery({
    queryKey: [QUERY_KEY.lps, "detail", numericLpId],

    queryFn: () => getLpDetail(numericLpId!),

    enabled: isValidId,

    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60,
  });
}

export default useGetLpDetail;
