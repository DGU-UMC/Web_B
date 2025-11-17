import { useMutation } from "@tanstack/react-query";
import { patchComment } from "../../apis/lp";
import { queryClient } from "../../App";
import { QUERY_KEY } from "../../constants/key";

function useUpdateComment(lpId: number) {
  return useMutation({
    mutationFn: ({
      commentId,
      content,
    }: {
      commentId: number;
      content: string;
    }) => patchComment({ lpId, commentId, content }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.comments, lpId],
      });
    },
  });
}

export default useUpdateComment;
