import { useMutation } from "@tanstack/react-query";
import { postLp } from "../../apis/lp";
import { queryClient } from "../../App";
import { QUERY_KEY } from "../../constants/key";

const usePostLp = () => {
  return useMutation({
    mutationFn: postLp,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.lps, data.data.id],
      });
    },
  });
};

export default usePostLp;
