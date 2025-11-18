import type { CommonResponse } from "./common";

export type User = {
    id: number;
    name: string;
    email: string;
    bio: string | null;
    avatar: string | null;
    createdAt: Date;
    updateAt: Date;
}

//회원가입
export type RequestSignupDto = {
    name: string;
    email: string;
    bio?: string;
    avatar?: string;
    password: string;
};

export type ResponseSignupDto = CommonResponse<User>;

//로그인
export type RequestSigninDto = {
    email: string;
    password: string;
};

export type ResponseSigninDto = CommonResponse<{
    id: number;
    name: string;
    accessToken: string;
    refreshToken: string;
}>;

//내 정보 조회
export type ResponseMyInfoDto = CommonResponse<{
    id: number;
    name: string;
    email: string;
    bio: string | null;
    avatar: string | null;
    createdAt: Date;
    updateAt: Date;
}>;

// 유저 정보 수정
export type UpdateUserDto = {
    name: string;
    bio?: string | null;
    avatar?: string | null;
  };