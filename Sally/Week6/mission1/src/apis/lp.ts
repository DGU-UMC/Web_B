import type { PaginationDto } from "../types/common.ts";
import type {
  ResponseLpListDto,
  ResponseLpDetailDto,
  ResponseCommentListDto,
  RequestCreateCommentDto,
  ResponseCreateCommentDto,
} from "../types/lp.ts";
import { axiosInstance } from "./axios.ts";

export const getLpList = async (
  paginationDto: PaginationDto
): Promise<ResponseLpListDto> => {
  const { data } = await axiosInstance.get("/v1/lps", {
    params: paginationDto,
  });

  return data;
};

export const getLpDetail = async (
  lpId: string
): Promise<ResponseLpDetailDto> => {
  const { data } = await axiosInstance.get(`/v1/lps/${lpId}`);

  return data;
};

export const getLpComments = async (
  lpId: string,
  paginationDto: PaginationDto
): Promise<ResponseCommentListDto> => {
  const { data } = await axiosInstance.get(`/v1/lps/${lpId}/comments`, {
    params: paginationDto,
  });

  return data;
};

export const createComment = async (
  lpId: string,
  commentData: RequestCreateCommentDto
): Promise<ResponseCreateCommentDto> => {
  const { data } = await axiosInstance.post(
    `/v1/lps/${lpId}/comments`,
    commentData
  );

  return data;
};
