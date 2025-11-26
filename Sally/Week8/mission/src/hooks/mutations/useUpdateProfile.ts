import { useMutation } from "@tanstack/react-query";
import { updateMyInfo } from "../../apis/auth";
import type {
  RequestUpdateProfileDto,
  ResponseUpdateProfileDto,
} from "../../types/auth";

function useUpdateProfile() {
  return useMutation<
    ResponseUpdateProfileDto,
    unknown,
    RequestUpdateProfileDto
  >({
    mutationFn: (payload) => updateMyInfo(payload),
  });
}

export default useUpdateProfile;
