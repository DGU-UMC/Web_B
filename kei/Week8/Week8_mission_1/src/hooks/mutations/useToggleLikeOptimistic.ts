// hooks/mutations/useToggleLikeOptimistic.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postLpLike, deleteLpLike } from "../../apis/lp";
import useMe from "../queries/useMe";

type ServerLike = { id: number; userId: number; lpId: number };

export default function useToggleLikeOptimistic(lpId: number) {
  const qc = useQueryClient();
  const { data: me } = useMe();        // seMe가 평탄화된 객체({ id, name, ... })를 반환해야 함
  const myId = me?.id;
  const detailKey = ["lp", lpId] as const;

  // 캐시에서 현재 좋아요 여부 확인
  const getLikedFromCache = () => {
    const lp: any = qc.getQueryData(detailKey);
    if (!lp || !Array.isArray(lp.likes) || myId == null) return false;
    return lp.likes.some((x: any) => x?.userId === myId);
  };

  return useMutation({
    // 서버 주도 토글: POST 먼저 → 409면 DELETE
    mutationFn: async () => {
      try {
        const created: ServerLike = await postLpLike(lpId);
        return { action: "add" as const, like: created };
      } catch (e: any) {
        const status = e?.response?.status;
        if (status === 409) {
          const removed: ServerLike = await deleteLpLike(lpId); // 200/201
          return { action: "remove" as const, like: removed };
        }
        throw e; // 다른 에러는 그대로
      }
    },

    // 낙관적 업데이트: 캐시를 바로 토글
    onMutate: async () => {
      await qc.cancelQueries({ queryKey: detailKey });
      const previous = qc.getQueryData(detailKey);

      const lp: any = previous;
      if (!lp || myId == null) return { previous };

      const liked = getLikedFromCache();

      const nextLikes = liked
        ? lp.likes.filter((x: any) => x.userId !== myId)                 // 낙관적 취소
        : [...(lp.likes ?? []), { id: -1, userId: myId, lpId }];         // 낙관적 추가(임시 id)

      qc.setQueryData(detailKey, { ...lp, likes: nextLikes });

      return { previous, optimisticAdded: !liked };
    },

    // 실패 시 롤백
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) qc.setQueryData(detailKey, ctx.previous);
    },

    // 성공 시: 임시 id를 서버 id로 치환(추가 케이스)
    onSuccess: (result) => {
      const lp: any = qc.getQueryData(detailKey);
      if (!lp || myId == null) return;

      if (result.action === "add") {
        // 낙관적으로 넣은 { id:-1, userId:myId }를 서버가 준 id로 교체
        const replaced = (lp.likes ?? []).map((x: any) =>
          x.userId === myId ? { ...x, id: result.like.id } : x
        );
        qc.setQueryData(detailKey, { ...lp, likes: replaced });
      }
      // remove 쪽은 낙관적에서 이미 빼놨으므로 별도 처리 불필요
    },

    // 최종적으로 서버와 동기화
    onSettled: () => {
      qc.invalidateQueries({ queryKey: detailKey });
      qc.invalidateQueries({ queryKey: ["lps"] });
    },
  });
}
