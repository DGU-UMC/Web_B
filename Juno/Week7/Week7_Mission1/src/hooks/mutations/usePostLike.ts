import { useMutation } from "@tanstack/react-query";
import { postLike } from "../../apis/lp";
import { queryClient } from "../../App";
import { QUERY_KEY } from "../../constants/key";

const usePostLike = () => {
  return useMutation({
    mutationFn: postLike,
    onSuccess: (data) => {
      // parameter 정리
      // data -> API 성공 응답 데이터
      // variables -> mutate에 전달한 값
      // context -> onMutate에서 반환한 값
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.lps, data.data.lpId],
        // exact: true, // queryKey가 모두 맞아야 함. false면 queryKey의 맨 앞부분만 맞아도 됨
      });
    },
    // onError: 요청 실패 시 실행되는 함수
    // onMutate: 요청 직전에 실행되는 함수
    // onSettled: 요청이 끝난 후 실행되는 함수
  });
};

export default usePostLike;
