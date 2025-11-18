import { useMutation } from "@tanstack/react-query";
import { deleteLike } from "../../apis/lp";
import { queryClient } from "../../App";
import { QUERY_KEY } from "../../constants/key";

const useDeleteLike = () => {
  return useMutation({
    mutationFn: deleteLike,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.lps, data.data.lpId],
        // exact: true, // queryKey가 모두 맞아야 함. false면 queryKey의 맨 앞부분만 맞아도 됨
      });
    },
  });
};

export default useDeleteLike;
