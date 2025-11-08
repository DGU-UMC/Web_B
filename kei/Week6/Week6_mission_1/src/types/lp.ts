import type { CursorBasedResponse } from "./common.ts";

export type Tag = {
    id: number;
    name: string;
};

export type Likes = {
    id: number;
    userId: number;
    lpId: number;
};

export type Lp = {
    updatedByName: string;
    id: number;
    title: string;
    content: string;
    thumbnail: string;
    published: boolean;
    authorId: number;
    createdAt: string;
    updatedAt: string;
    tags: Tag[];
    likes: Likes[];
};

export type ResponseLpListDto = CursorBasedResponse<Lp[]>;

export type UpdateLpDto = {
  title?: string;
  content?: string;
  thumbnail?: string;
  tags?: string[];   
  published?: boolean;
};
