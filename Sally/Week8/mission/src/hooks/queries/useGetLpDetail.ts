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
    enabled: !!lpId,

    staleTime: 1000 * 60 * 5,

    gcTime: 1000 * 60 * 10,
  });
}

export default useGetLpDetail;
