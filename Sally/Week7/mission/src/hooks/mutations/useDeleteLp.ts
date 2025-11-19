import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteLp } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";

function useDeleteLp(lpId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!lpId) {
        throw new Error("LP ID is required");
      }

      return deleteLp(lpId);
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

export default useDeleteLp;
