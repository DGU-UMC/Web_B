import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteLp } from "../../apis/lp";

export default function useDeleteLp(lpId: number) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: () => deleteLp(lpId),
    onSuccess: () => {
      // 상세 캐시 제거 + 목록 갱신
      qc.removeQueries({ queryKey: ["lp", String(lpId)] });
      qc.invalidateQueries({ queryKey: ["lps"] });
    },
  });
}
