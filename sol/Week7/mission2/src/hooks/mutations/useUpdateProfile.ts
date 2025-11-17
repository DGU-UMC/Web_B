import { useMutation } from "@tanstack/react-query";
import { patchMyProfile } from "../../apis/auth";
import { queryClient } from "../../App";
import { QUERY_KEY } from "../../constants/key";

function useUpdateProfile() {
  return useMutation({
    mutationFn: (formData: FormData) => patchMyProfile(formData),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY.myInfo] });
    },
  });
}

export default useUpdateProfile;
