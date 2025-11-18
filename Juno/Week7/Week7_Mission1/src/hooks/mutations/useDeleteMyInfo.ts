import { useMutation } from "@tanstack/react-query";
import { deleteMyInfo } from "../../apis/users";
import { queryClient } from "../../App";
import { QUERY_KEY } from "../../constants/key";
import { useNavigate } from "react-router-dom";

const useDeleteMyInfo = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: deleteMyInfo,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.myInfo],
      });
      navigate("/"); // 성공 시 홈 화면으로 리다이렉트
    },
  });
};

export default useDeleteMyInfo;
