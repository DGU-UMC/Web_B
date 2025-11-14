import { useQuery } from "@tanstack/react-query";
import { getLpById } from "../../apis/lp";

export default function useGetLp(lpId?: string) {
  const id = Number(lpId);
  return useQuery({
    queryKey: ['lp', id],
    queryFn: () => getLpById(String(lpId)), // ← Lp 객체 반환
    enabled: !!lpId,
    staleTime: 30_000,
  });
}
