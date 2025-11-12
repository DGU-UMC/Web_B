import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createComment } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";
import type { RequestCreateCommentDto } from "../../types/lp";

function useCreateLpComment(lpId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (commentData: RequestCreateCommentDto) => {
      if (!lpId) {
        throw new Error("LP ID is required");
      }

      return createComment(lpId, commentData);
    },
    onSuccess: async () => {
      if (!lpId) {
        return;
      }

      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.lpComments, lpId],
      });
    },
  });
}

export default useCreateLpComment;

