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
    id: number;
    title: string;
    content: string;
    thumbnail: string;
    published: boolean;
    authorId: number;
    createAt: Date;
    updatedAt: Date;
    tags: Tag[];
    lkes: Likes[];
};

export type ResponseLpListDto = CursorBasedResponse<Lp[]>;