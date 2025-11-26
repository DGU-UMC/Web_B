import { useMutation } from "@tanstack/react-query";
import { postLpComment } from "../../apis/lp";
import { queryClient } from "../../App";
import { QUERY_KEY } from "../../constants/key";
import type { PAGINATION_ORDER } from "../../enums/common";

const usePostLpComment = (lpId: number, order: PAGINATION_ORDER) => {
  return useMutation({
    mutationFn: (content: string) => postLpComment(lpId, content),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.comments, data.lpId, order],
      });
    },
  });
};

export default usePostLpComment;
