import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateLp } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";
import type { RequestUpdateLpDto } from "../../types/lp";

function useUpdateLp(lpId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updateData: RequestUpdateLpDto) => {
      if (!lpId) {
        throw new Error("LP ID is required");
      }

      return updateLp(lpId, updateData);
    },
    onSuccess: async () => {
      if (!lpId) {
        return;
      }

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEY.lp, lpId],
        }),
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEY.lps],
          exact: false,
        }),
      ]);
    },
  });
}

export default useUpdateLp;

