import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateComment } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";

type UpdateCommentVariables = {
  commentId: number;
  content: string;
};

function useUpdateLpComment(lpId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ commentId, content }: UpdateCommentVariables) => {
      if (!lpId) {
        throw new Error("LP ID is required");
      }

      return updateComment(lpId, commentId, { content });
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

export default useUpdateLpComment;

