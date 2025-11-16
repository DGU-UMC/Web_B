import type { CommonResponse, CursorBasedResponse } from "./common";

export type Tag = {
  id: number;
  name: string;
};

export type Likes = {
  id: number;
  userId: number;
  lpId: number;
};

export type Author = {
  id: number;
  name: string;
  email: string;
  bio: null | string;
  avatar: null | string;
  createdAt: string;
  updatedAt: string;
};

export type Lp = {
  id: number;
  title: string;
  content: string;
  thumbnail: string;
  published: boolean;
  authorId: number;
  updatedAt: string;
  createdAt: string;
  tags: Tag[];
  likes: Likes[];
};

export type ResponseLpListDto = CursorBasedResponse<Lp[]>;

export type ResponseLpDetailDto = CommonResponse<{
  id: number;
  title: string;
  content: string;
  thumbnail: string;
  published: boolean;
  authorId: number;
  updatedAt: string;
  createdAt: string;
  tags: Tag[];
  likes: Likes[];
  author: Author;
}>;

export type RequestLpCommentsDto = {
  lpId: number;
  cursor?: number;
  limit?: number;
  order?: string;
};

export type Comment = {
  id: number;
  content: string;
  lpId: number;
  authorId: number;
  createdAt: string;
  updatedAt: string;
  author: Author;
};

export type ResponseLpCommentsDto = CursorBasedResponse<Comment[]>;

export type ResponseLikeLpDto = CommonResponse<{
  id: number;
  userId: number;
  lpId: number;
}>;

export type RequestLpDto = {
  title: string;
  content: string;
  thumbnail?: string;
  tags: string[];
  published: boolean;
};

export type ResponseLpDto = CommonResponse<{
  id: number;
  title: string;
  content: string;
  thumbnail: string;
  published: boolean;
  authorId: number;
  updatedAt: string;
  createdAt: string;
}>;

export type ResponsePatchLpCommentDto = CommonResponse<Comment>;

export type ResponseDeleteLpCommentDto = CommonResponse<{ message: string }>;
