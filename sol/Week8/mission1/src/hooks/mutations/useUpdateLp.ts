import { useMutation } from "@tanstack/react-query";
import { updateLp } from "../../apis/lp";
import { queryClient } from "../../App";
import { QUERY_KEY } from "../../constants/key";
import type { UpdateLpRequest } from "../../types/lp";

function useUpdateLp(lpId: number) {
  return useMutation({
    mutationFn: (body: UpdateLpRequest) => updateLp(body),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY.lps, lpId] });
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY.lps] });
    },
  });
}

export default useUpdateLp;
