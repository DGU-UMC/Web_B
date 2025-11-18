import { useMutation } from "@tanstack/react-query";
import { patchMyInfo } from "../../apis/users";
import { queryClient } from "../../App";
import { QUERY_KEY } from "../../constants/key";
import type { ResponseUserInfoDto } from "../../types/auth";

const usePatchMyInfo = () => {
  return useMutation({
    mutationFn: patchMyInfo,
    // optimistic update 적용 전
    // onSuccess: () => {
    //   queryClient.invalidateQueries({
    //     queryKey: [QUERY_KEY.myInfo],
    //   });
    // },
    // optimistic update
    // onMutate: API 요청 호출 이전에 호출
    onMutate: async (requestPatchUserInfoDto) => {
      // 캐시된 데이터를 새로 불러오는 요청(refetch) 취소
      await queryClient.cancelQueries({
        queryKey: [QUERY_KEY.myInfo],
      });

      // 현재 캐시된 데이터 가져오기(실패 시 롤백용)
      const previousMyInfo = queryClient.getQueryData<ResponseUserInfoDto>([
        QUERY_KEY.myInfo,
      ]);

      // 데이터를 복사해 새로운 객체 생성(깊은 복사)
      const newMyInfo = JSON.parse(
        JSON.stringify(previousMyInfo)
      ) as ResponseUserInfoDto;

      newMyInfo.data.name = requestPatchUserInfoDto.name;
      newMyInfo.data.bio = requestPatchUserInfoDto.bio;
      queryClient.setQueryData([QUERY_KEY.myInfo], newMyInfo);

      return { previousMyInfo, newMyInfo };
    },
    // onError: 오류 발생 시 실행
    onError: (err, newMyInfo, context) => {
      console.log(err, newMyInfo);
      queryClient.setQueryData([QUERY_KEY.myInfo], context?.previousMyInfo);
    },
    // onSettled: API 요청이 끝난 후 성공하든 실패하든 실행
    onSettled: async (data, error, requestPatchUserInfoDto, context) => {
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.myInfo],
      });
    },
  });
};

export default usePatchMyInfo;
