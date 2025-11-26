import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postLpComment } from "../../apis/comments";
import type { PAGINATION_ORDER } from "../../enums/common";

export default function useCreateComment(lpId: number, order: PAGINATION_ORDER) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (content: string) => postLpComment(lpId, content),
    onSuccess: () => {
      // 정렬 바뀐 상태 보존하면서 첫 페이지부터 새로고침
      qc.invalidateQueries({ queryKey: ["lpComments", lpId, order] });
    },
  });
}