import { useQuery } from "@tanstack/react-query";
import { getMyInfo } from "../../apis/auth";
import { QUERY_KEY } from "../../constants/key";

const useGetMyInfo = (accessToken: string | null) => {
  return useQuery({
    queryFn: getMyInfo,
    queryKey: [QUERY_KEY.myInfo],
    enabled: !!accessToken,
  });
};

export default useGetMyInfo;
