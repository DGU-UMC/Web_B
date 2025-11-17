import { useMutation } from "@tanstack/react-query";
import { patchMyProfile } from "../../apis/auth";
import { queryClient } from "../../App";
import { QUERY_KEY } from "../../constants/key";
import type { UpdateProfileRequestDto } from "../../types/auth";

function useUpdateProfile() {
  return useMutation({
    mutationFn: (body: UpdateProfileRequestDto) => patchMyProfile(body),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY.myInfo] });
    },
  });
}

export default useUpdateProfile;
