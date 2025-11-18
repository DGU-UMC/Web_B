import { useQuery } from "@tanstack/react-query";
import { getLpById } from "../../apis/lp";
import type { Lp } from "../../types/lp";

export default function useGetLp(lpid?: string) {
    return useQuery<Lp, Error>({
        queryKey: ['lp', lpid],
        queryFn: () => getLpById(lpid as string),
        enabled: !!lpid, //param 준비되었을 때만 요청
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
    });
};