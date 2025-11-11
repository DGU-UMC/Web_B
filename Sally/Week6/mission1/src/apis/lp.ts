import type { PaginationDto } from "../types/common.ts";
import type {
  ResponseLpListDto,
  ResponseLpDetailDto,
  ResponseCommentListDto,
  RequestCreateCommentDto,
  ResponseCreateCommentDto,
  RequestCreateLpDto,
  ResponseCreateLpDto,
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

// 이미지 업로드 API
export const uploadImage = async (
  file: File,
  isPublic: boolean = false
): Promise<{ imageUrl: string }> => {
  const formData = new FormData();
  formData.append("file", file);

  const endpoint = isPublic ? "/v1/uploads/public" : "/v1/uploads";
  const { data } = await axiosInstance.post(endpoint, formData);

  // 응답 형식 처리: CommonResponse 형식 또는 직접 형식
  let imageUrl: string | undefined;

  if (data?.data?.imageUrl) {
    // CommonResponse 형식: { status: true, data: { imageUrl: "..." } }
    imageUrl = data.data.imageUrl;
  } else if (data?.imageUrl) {
    // 직접 형식: { imageUrl: "..." }
    imageUrl = data.imageUrl;
  } else if (data?.data && typeof data.data === "string") {
    // data가 문자열인 경우
    imageUrl = data.data;
  }

  if (!imageUrl) {
    throw new Error("이미지 URL을 찾을 수 없습니다.");
  }

  return { imageUrl };
};

export const createLp = async (
  lpData: RequestCreateLpDto
): Promise<ResponseCreateLpDto> => {
  // 항상 JSON body로 전송
  const requestBody: {
    title: string;
    content: string;
    published: boolean;
    thumbnail?: string;
    tags?: string[];
  } = {
    title: lpData.title,
    content: lpData.content,
    published: lpData.published ?? true,
  };

  // 썸네일 처리: 이미 URL 문자열이면 그대로 사용
  if (lpData.thumbnail && typeof lpData.thumbnail === "string") {
    requestBody.thumbnail = lpData.thumbnail;
  }

  // tags가 있으면 배열로 전송 (빈 배열이어도 전송)
  if (lpData.tags && Array.isArray(lpData.tags)) {
    requestBody.tags = lpData.tags;
  }

  const { data } = await axiosInstance.post("/v1/lps", requestBody);
  return data;
};
