import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchLpComment } from "../../apis/comments";
import type { PAGINATION_ORDER } from "../../enums/common";

export default function useUpdateComment(
  lpId: number,
  order: PAGINATION_ORDER,
) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: { commentId: number; content: string }) =>
      patchLpComment(lpId, p.commentId, p.content),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["lpComments", lpId, order] });
    },
  });
}