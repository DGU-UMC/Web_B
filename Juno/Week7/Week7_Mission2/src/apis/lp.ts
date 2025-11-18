import type { PaginationDto } from "../types/common";
import type {
  Comment,
  RequestLpCommentsDto,
  RequestLpDto,
  RequestPatchLpDto,
  ResponseDeleteLpCommentDto,
  ResponseLikeLpDto,
  ResponseLpCommentsDto,
  ResponseLpDetailDto,
  ResponseLpDto,
  ResponseLpListDto,
  ResponsePatchLpCommentDto,
  ResponsePatchLpDto,
} from "../types/lp";
import { axiosInstance } from "./axios";

export const getLpList = async (
  paginationDto: PaginationDto
): Promise<ResponseLpListDto> => {
  const { data } = await axiosInstance.get("v1/lps", {
    params: paginationDto,
  });

  return data;
};

export const getLpDetail = async (
  lpId: number
): Promise<ResponseLpDetailDto> => {
  const { data } = await axiosInstance.get(`v1/lps/${lpId}`);

  return data;
};

export const getLpComments = async (
  requestLpCommentsDto: RequestLpCommentsDto
): Promise<ResponseLpCommentsDto> => {
  const { lpId, ...rest } = requestLpCommentsDto;
  const { data } = await axiosInstance.get(`v1/lps/${lpId}/comments`, {
    params: rest,
  });

  return data;
};

export const postLike = async (lpId: number): Promise<ResponseLikeLpDto> => {
  const { data } = await axiosInstance.post(`v1/lps/${lpId}/likes`);

  return data;
};

export const deleteLike = async (lpId: number): Promise<ResponseLikeLpDto> => {
  const { data } = await axiosInstance.delete(`v1/lps/${lpId}/likes`);

  return data;
};

export const postLp = async (
  requestLpDto: RequestLpDto
): Promise<ResponseLpDto> => {
  const { data } = await axiosInstance.post("v1/lps", requestLpDto);

  return data;
};

export const patchLp = async (
  requestPatchLpDto: RequestPatchLpDto
): Promise<ResponsePatchLpDto> => {
  const { id, ...body } = requestPatchLpDto;
  const { data } = await axiosInstance.patch(`v1/lps/${id}`, body);

  return data;
};

export const postLpComment = async (
  lpId: number,
  content: string
): Promise<Comment> => {
  const { data } = await axiosInstance.post(`v1/lps/${lpId}/comments`, {
    content: content,
  });

  return data;
};

export const patchLpComment = async (
  lpId: number,
  commentId: number,
  content: string
): Promise<ResponsePatchLpCommentDto> => {
  const { data } = await axiosInstance.patch(
    `v1/lps/${lpId}/comments/${commentId}`,
    { content: content }
  );

  return data;
};

export const deleteLpComment = async (
  lpId: number,
  commentId: number
): Promise<ResponseDeleteLpCommentDto> => {
  const { data } = await axiosInstance.delete(
    `v1/lps/${lpId}/comments/${commentId}`
  );

  return data;
};
