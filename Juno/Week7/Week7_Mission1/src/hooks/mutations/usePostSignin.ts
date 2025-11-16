import { useMutation } from "@tanstack/react-query";
import { postSignin } from "../../apis/auth";
import { queryClient } from "../../App";
import { QUERY_KEY } from "../../constants/key";

const usePostSignin = () => {
  return useMutation({
    mutationFn: postSignin,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.myInfo],
      });
    },
  });
};

export default usePostSignin;
