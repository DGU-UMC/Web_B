import type { commonResponse, CursorBasedResponse } from "./common";

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

export type ResponseLpListDto = CursorBasedResponse<{
  data: {
    id: number;
    title: string;
    content: string;
    thumnail: string;
    published: boolean;
    authorId: number;
    updatedAt: string;
    createdAt: string;
    tags: Tag[];
    likes: Likes[];
  }[];
}>;

export type ResponseLpDetailDto = commonResponse<{
  id: number;
  title: string;
  content: string;
  thumnail: string;
  published: boolean;
  authorId: number;
  updatedAt: string;
  createdAt: string;
  tags: Tag[];
  likes: Likes[];
  author: Author;
}>;
