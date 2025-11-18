import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UpdateOrCreateLpDto } from "../../types/lp";
import { patchLp } from "../../apis/lp";

export default function useUpdateLp (lpId: number) {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (dto: UpdateOrCreateLpDto) => patchLp(lpId, dto),
        onSuccess: (updated) => {
            queryClient.setQueryData(['lp', String(lpId)], updated); // 상세 캐시 최신화
            queryClient.invalidateQueries({ queryKey: ['lp', lpId] });
            queryClient.invalidateQueries({ queryKey: ['lps'] });

        },
    });
}