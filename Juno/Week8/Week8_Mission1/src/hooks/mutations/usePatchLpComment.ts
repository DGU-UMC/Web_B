import { useMutation } from "@tanstack/react-query";
import { patchLpComment } from "../../apis/lp";
import { queryClient } from "../../App";
import { QUERY_KEY } from "../../constants/key";

const usePatchLpComment = (
  lpId: number,
  commentId: number,
  content: string
) => {
  return useMutation({
    mutationFn: () => patchLpComment(lpId, commentId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.comments, lpId],
      });
    },
  });
};

export default usePatchLpComment;
