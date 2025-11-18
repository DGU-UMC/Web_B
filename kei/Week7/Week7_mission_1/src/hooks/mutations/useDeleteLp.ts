import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteLp, lpKeys } from "../../apis/lp";

export default function useDeleteLp(lpId: number) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: () => deleteLp(lpId),
    onSuccess: () => {
      // 상세 캐시 제거 + 목록 갱신
      qc.invalidateQueries({ queryKey: lpKeys.all });
      qc.invalidateQueries({ queryKey: lpKeys.detail(lpId) });
    },
  });
}
