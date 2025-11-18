import { axiosInstance } from "./axios";
import type { CursorBasedResponse } from "../types/common";
import type { PAGINATION_ORDER } from "../enums/common";

export type CommentAuthor = {
  id: number;
  name: string;
  email: string;
  bio: string | null;
  avatar: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Comment = {
  id: number;
  content: string;
  lpId: number;
  authorId: number;
  createdAt: string;
  updatedAt: string;
  author: CommentAuthor;
};

export type CommentListRes = CursorBasedResponse<Comment[]>;

export async function getLpComments(
  lpId: number,
  params: { cursor?: number; limit?: number; order?: PAGINATION_ORDER }
): Promise<CommentListRes> {
  const { data } = await axiosInstance.get(`/v1/lps/${lpId}/comments`, {
    params,
  });
  return data as CommentListRes;
}

export async function postLpComment(lpId: number, content: string) {
  const { data } = await axiosInstance.post(`/v1/lps/${lpId}/comments`, {
    content,
  });
  return data as { data: Comment };
}

export async function patchLpComment(
  lpId: number,
  commentId: number,
  content: string
) {
  const { data } = await axiosInstance.patch(
    `/v1/lps/${lpId}/comments/${commentId}`,
    { content }
  );
  return data as { data: Comment };
}

export async function deleteLpComment(lpId: number, commentId: number) {
  const { data } = await axiosInstance.delete(
    `/v1/lps/${lpId}/comments/${commentId}`
  );
  return data as {
    status: boolean;
    statusCode: number;
    message: string;
    data: { message: string };
  };
}
