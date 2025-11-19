import { axiosInstance } from "./axios";
import type { PaginationDto } from "../types/common";
import type {
  RequestLpDto,
  ResponseLikeLpDto,
  ResponseLpDetailDto,
  ResponseLpListDto,
  ResponseLpDto,
  ResponseCommentListDto,
  ResponseCommentDto,
  CreateLpRequest,
  UpdateLpRequest,
} from "../types/lp";
export const getLpList = async (
  paginationDto: PaginationDto
): Promise<ResponseLpListDto> => {
  const { data } = await axiosInstance.get("/v1/lps", {
    params: paginationDto,
  });
  return data;
};

export const getLpDetail = async ({
  lpId,
}: RequestLpDto): Promise<ResponseLpDetailDto> => {
  const { data } = await axiosInstance.get(`/v1/lps/${lpId}`);

  return data;
};

export const postLike = async ({
  lpId,
}: RequestLpDto): Promise<ResponseLikeLpDto> => {
  const { data } = await axiosInstance.post(`/v1/lps/${lpId}/likes`);

  return data;
};

export const deleteLike = async ({
  lpId,
}: RequestLpDto): Promise<ResponseLikeLpDto> => {
  const { data } = await axiosInstance.delete(`/v1/lps/${lpId}/likes`);

  return data;
};

export const createLp = async (
  body: CreateLpRequest
): Promise<ResponseLpDto> => {
  const { data } = await axiosInstance.post("/v1/lps", body);
  return data;
};

export const updateLp = async ({
  lpId,
  ...body
}: UpdateLpRequest): Promise<ResponseLpDto> => {
  const { data } = await axiosInstance.patch(`/v1/lps/${lpId}`, body);
  return data;
};

export const deleteLp = async ({ lpId }: RequestLpDto) => {
  const { data } = await axiosInstance.delete(`/v1/lps/${lpId}`);
  return data;
};

export const getComments = async (
  lpId: number
): Promise<ResponseCommentListDto> => {
  const { data } = await axiosInstance.get(`/v1/lps/${lpId}/comments`);
  return data;
};

export const postComment = async ({
  lpId,
  content,
}: {
  lpId: number;
  content: string;
}): Promise<ResponseCommentDto> => {
  const { data } = await axiosInstance.post(`/v1/lps/${lpId}/comments`, {
    content,
  });
  return data;
};

export const patchComment = async ({
  lpId,
  commentId,
  content,
}: {
  lpId: number;
  commentId: number;
  content: string;
}): Promise<ResponseCommentDto> => {
  const { data } = await axiosInstance.patch(
    `/v1/lps/${lpId}/comments/${commentId}`,
    { content }
  );
  return data;
};

export const deleteCommentApi = async ({
  lpId,
  commentId,
}: {
  lpId: number;
  commentId: number;
}): Promise<ResponseCommentDto> => {
  const { data } = await axiosInstance.delete(
    `/v1/lps/${lpId}/comments/${commentId}`
  );
  return data;
};
