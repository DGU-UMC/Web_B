import { useMutation } from "@tanstack/react-query";
import { deleteCommentApi } from "../../apis/lp";
import { queryClient } from "../../App";
import { QUERY_KEY } from "../../constants/key";

function useDeleteComment(lpId: number) {
  return useMutation({
    mutationFn: (commentId: number) =>
      deleteCommentApi({ lpId, commentId }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.comments, lpId],
      });
    },
  });
}

export default useDeleteComment;
