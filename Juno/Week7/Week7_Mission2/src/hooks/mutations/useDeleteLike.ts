import { useMutation } from "@tanstack/react-query";
import { deleteLike } from "../../apis/lp";
import { queryClient } from "../../App";
import { QUERY_KEY } from "../../constants/key";
import type { Likes, ResponseLpDetailDto } from "../../types/lp";
import type { ResponseUserInfoDto } from "../../types/auth";

const useDeleteLike = () => {
  return useMutation({
    mutationFn: deleteLike,
    // optimistic update
    // onMutate: API 요청 호출 이전에 호출
    onMutate: async (lpId) => {
      // 캐시된 데이터를 새로 불러오는 요청(refetch) 취소
      await queryClient.cancelQueries({
        queryKey: [QUERY_KEY.lps, lpId],
      });

      // 현재 캐시된 데이터 가져오기
      const previousLpPost = queryClient.getQueryData<ResponseLpDetailDto>([
        QUERY_KEY.lps,
        lpId,
      ]);

      // 데이터를 복사해 새로운 객체 생성(실패 시 롤백용)
      const newLpPost = { ...previousLpPost };

      // 좋아요 여부 확인 로직
      const me = queryClient.getQueryData<ResponseUserInfoDto>([
        QUERY_KEY.myInfo,
      ]);
      const userId = Number(me?.data.id);
      const likedIndex =
        previousLpPost?.data.likes.findIndex(
          (like) => like.userId === userId
        ) ?? -1; // 좋아요를 누르지 않았다면 -1 반환

      // 좋아요 취소 로직
      if (likedIndex >= 0) {
        previousLpPost?.data.likes.splice(likedIndex, 1);
      } else {
        const newLike = { userId: userId, lpId: lpId } as Likes; // UI 업데이트용이므로 데이터가 유효하지 않아도 괜찮다.
        previousLpPost?.data.likes.push(newLike);
      }
      queryClient.setQueryData([QUERY_KEY.lps, lpId], newLpPost);

      return { previousLpPost, newLpPost };
    },
    // onError: 오류 발생 시 실행
    onError: (err, newLpId, context) => {
      console.log(err, newLpId);
      queryClient.setQueryData(
        [QUERY_KEY.lps, newLpId],
        context?.previousLpPost?.data.id
      );
    },
    // onSettled: API 요청이 끝난 후 성공하든 실패하든 실행
    onSettled: async (data, error, lpId, context) => {
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.lps, lpId],
      });
    },
  });
};

export default useDeleteLike;
