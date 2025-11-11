import type { CommonResponse, CusorBasedResponse } from "./common";

export type Author = {
  id: number;
  name: string;
  email: string;
  bio: string | null;
  avatar: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Tag = {
  id: number;
  name: string;
};

export type Likes = {
  id: number;
  userId: number;
  lpId: number;
};

export type LpDetailData = {
  id: number;
  title: string;
  content: string;
  thumbnail: string | null;
  published: boolean;
  authorId: number;
  createdAt: string;
  updatedAt: string;
  author: Author;
  tags: Tag[];
  likes: Likes[];
};

export type ResponseLpListDto = CusorBasedResponse<{
  data: {
    id: number;
    title: string;
    content: string;
    thumbnail: string;
    published: boolean;
    authorId: number;
    createdAt: Date;
    updatedAt: Date;
    tags: Tag[];
    likes: Likes[];
  }[];
}>;

export type ResponseLpDetailDto = CommonResponse<LpDetailData>;

export type Comment = {
  id: number;
  content: string;
  lpId: number;
  userId: number;
  createdAt: string;
  updatedAt: string;
  author: Author;
};

export type ResponseCommentListDto = CusorBasedResponse<{
  data: Comment[];
}>;

export type RequestCreateCommentDto = {
  content: string;
};

export type ResponseCreateCommentDto = CommonResponse<Comment>;

export type RequestCreateLpDto = {
  title: string;
  content: string;
  thumbnail?: File | string; // File 객체 또는 URL 문자열
  tags?: string[]; // 태그 배열
  published?: boolean;
};

export type ResponseCreateLpDto = CommonResponse<LpDetailData>;
