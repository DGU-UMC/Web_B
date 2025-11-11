import type { PaginationDto } from "../types/common.ts";
import type { ResponseLpListDto, ResponseLpDetailDto } from "../types/lp.ts";
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
