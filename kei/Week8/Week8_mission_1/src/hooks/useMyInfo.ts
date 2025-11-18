import { useQuery } from "@tanstack/react-query";
import { getMyInfo } from "../apis/auth";

export function useMyInfo(enabled = true) {
    return useQuery({
        queryKey: ['myinfo'],
        queryFn: getMyInfo,
        staleTime: 1000 * 60 * 5,
        enabled,
    });
};