import { useQuery } from "@tanstack/react-query";
import { getComments } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";

function useGetComments(lpId: number | undefined) {
  return useQuery({
    queryKey: [QUERY_KEY.comments, lpId],
    queryFn: () => getComments(lpId as number),
    enabled: !!lpId,
  });
}

export default useGetComments;
