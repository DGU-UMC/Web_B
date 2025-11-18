import { useMutation } from "@tanstack/react-query";
import { createLp } from "../../apis/lp";
import { queryClient } from "../../App";
import { QUERY_KEY } from "../../constants/key";
import type { CreateLpRequest } from "../../types/lp";

function useCreateLp() {
  return useMutation({
    mutationFn: (body: CreateLpRequest) => createLp(body),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY.lps] });
    },
  });
}

export default useCreateLp;
