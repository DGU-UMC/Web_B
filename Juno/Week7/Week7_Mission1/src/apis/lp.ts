import type { PaginationDto } from "../types/common";
import type {
  Comment,
  RequestLpCommentsDto,
  RequestLpDto,
  ResponseLikeLpDto,
  ResponseLpCommentsDto,
  ResponseLpDetailDto,
  ResponseLpDto,
  ResponseLpListDto,
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

export const postLpComment = async (
  lpId: number,
  content: string
): Promise<Comment> => {
  const { data } = await axiosInstance.post(`v1/lps/${lpId}/comments`, {
    content: content,
  });

  return data;
};
