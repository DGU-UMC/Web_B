import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteLpComment } from "../../apis/comments";
import type { PAGINATION_ORDER } from "../../enums/common";

export default function useDeleteComment(
  lpId: number,
  order: PAGINATION_ORDER,
) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (commentId: number) => deleteLpComment(lpId, commentId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["lpComments", lpId, order] });
    },
  });
}