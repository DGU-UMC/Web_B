import { useMutation } from "@tanstack/react-query";
import { updateMyInfo } from "../../apis/auth";
import type {
  RequestUpdateProfileDto,
  ResponseUpdateProfileDto,
} from "../../types/auth";
import { useAuth } from "../../context/AuthContext";

function useUpdateProfile() {
  const { updateUserInfo } = useAuth();

  return useMutation<
    ResponseUpdateProfileDto,
    unknown,
    RequestUpdateProfileDto
  >({
    mutationFn: (payload) => updateMyInfo(payload),
    onMutate: async (payload) => {
      // 닉네임이 변경되는 경우 즉시 업데이트
      if (payload.name !== undefined) {
        updateUserInfo({ name: payload.name });
      }
    },
  });
}

export default useUpdateProfile;
