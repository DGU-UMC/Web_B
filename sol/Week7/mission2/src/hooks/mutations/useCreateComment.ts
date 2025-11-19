import { useMutation } from "@tanstack/react-query";
import { postComment } from "../../apis/lp";
import { queryClient } from "../../App";
import { QUERY_KEY } from "../../constants/key";

function useCreateComment(lpId: number) {
  return useMutation({
    mutationFn: (content: string) => postComment({ lpId, content }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.comments, lpId],
      });
    },
  });
}

export default useCreateComment;
