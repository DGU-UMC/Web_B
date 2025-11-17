import type { CommonResponse, CursorBasedResponse } from "./common";

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

export type Comment = {
  id: number;
  content: string;
  userId: number;
  lpId: number;
  author?: Author;
  createdAt: string;
  updatedAt: string;
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

export type Lp = {
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
};

export type RequestLpDto = {
  lpId: number;
};

export type CreateLpRequest = {
  title: string;
  content: string;
  thumbnail?: string | null;
  tags: string[];
  published: boolean;
};

export type ResponseLpDto = CommonResponse<Lp>;
export type ResponseLpListDto = CursorBasedResponse<Lp[]>;
export type ResponseLpDetailDto = CommonResponse<LpDetailData>;

export type ResponseLikeLpDto = CommonResponse<{
  id: number;
  userId: number;
  lpId: number;
}>;

export type ResponseCommentListDto = CommonResponse<Comment[]>;
export type ResponseCommentDto = CommonResponse<Comment>;
