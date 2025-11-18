import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postLpLike } from "../../apis/lp";

export default function useLikeLp(lpId: number) {
  const qc = useQueryClient();
  const key = ["lp", String(lpId)];

  return useMutation({
    mutationFn: () => postLpLike(lpId),

    // 낙관적 업데이트
    onMutate: async () => {
      await qc.cancelQueries({ queryKey: key });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const prev = qc.getQueryData<any>(key);
        const next = {
          ...prev,
          likes: Array.isArray(prev.likes)
            ? [...prev.likes, { id: "temp-like" }]
            : [{ id: "temp-like" }],
        };
        qc.setQueryData(key, next);
      return { prev };
    },

    // 실패 시 롤백
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(key, ctx.prev);
    },

    // 성공/실패 관계없이 서버 값으로 동기화
    onSettled: () => {
      qc.invalidateQueries({ queryKey: key });
      // 목록에도 반영 필요하면 아래 주석 해제
      qc.invalidateQueries({ queryKey: ["lps"] });
    },
  });
}
