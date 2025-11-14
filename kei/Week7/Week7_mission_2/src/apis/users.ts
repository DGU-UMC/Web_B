import type { UpdateUserDto, User } from "../types/auth";
import { axiosInstance } from "./axios";

export async function patchMyInfo(body: UpdateUserDto) {
  const { data } = await axiosInstance.patch<{ data: User }>("/v1/users", body);
  
  return data.data;
}

export async function deleteMyAccount() {
    const { data } = await axiosInstance.delete('/v1/users');

    return data;
}