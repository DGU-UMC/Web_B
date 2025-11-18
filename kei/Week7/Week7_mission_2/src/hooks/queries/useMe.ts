import { useQuery } from "@tanstack/react-query";
import { getMyInfo } from "../../apis/auth";
import { useAuth } from "../../context/AuthContext";

export const meKey = ['me'] as const;

export default function useMe() {
    const { accessToken } = useAuth();
    return useQuery({
        queryKey: meKey,
        queryFn: async () => {
            const res = await getMyInfo();
            return res.data;
        },
        enabled: !!accessToken,
        staleTime: 60_000,
    });
}