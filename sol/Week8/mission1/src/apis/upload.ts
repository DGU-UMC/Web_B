import { axiosInstance } from "./axios";
import type { CommonResponse } from "../types/common";

export type UploadResponse = CommonResponse<{ imageUrl: string }>;

export const uploadImage = async (
  file: File,
  isPublic = true
): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append("file", file);
  const path = isPublic ? "/v1/uploads/public" : "/v1/uploads";
  const { data } = await axiosInstance.post(path, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};
