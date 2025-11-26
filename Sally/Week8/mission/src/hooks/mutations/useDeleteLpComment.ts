import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteComment } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";

type DeleteCommentVariables = {
  commentId: number;
};

function useDeleteLpComment(lpId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ commentId }: DeleteCommentVariables) => {
      if (!lpId) {
        throw new Error("LP ID is required");
      }

      return deleteComment(lpId, commentId);
    },
    onSuccess: async () => {
      if (!lpId) {
        return;
      }

      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.lpComments, lpId],
        exact: false,
      });
    },
  });
}

export default useDeleteLpComment;

