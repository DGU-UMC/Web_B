import type {
  RequestPatchUserInfoDto,
  ResponseUserInfoDto,
} from "../types/auth";
import { axiosInstance } from "./axios";

export const getMyInfo = async (): Promise<ResponseUserInfoDto> => {
  const { data } = await axiosInstance.get("v1/users/me");

  return data;
};

export const patchMyInfo = async (
  body: RequestPatchUserInfoDto
): Promise<ResponseUserInfoDto> => {
  const { data } = await axiosInstance.patch("v1/users", body);

  return data;
};

export const deleteMyInfo = async () => {
  await axiosInstance.delete("v1/users");
};
