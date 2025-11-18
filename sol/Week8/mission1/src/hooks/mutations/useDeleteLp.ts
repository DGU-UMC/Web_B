import { useMutation } from "@tanstack/react-query";
import { deleteLp } from "../../apis/lp";
import { queryClient } from "../../App";
import { QUERY_KEY } from "../../constants/key";

function useDeleteLp(lpId: number) {
  return useMutation({
    mutationFn: () => deleteLp({ lpId }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY.lps] });
    },
  });
}

export default useDeleteLp;
