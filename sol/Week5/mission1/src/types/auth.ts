import type { CommonRespnse } from "./common";

// 회원가입
export type RequestSignupDto = {
  name: string;
  email: string;
  bio?: string;
  avatar?: string;
  password: string;
};

export type ResponseSignupDto = CommonRespnse<{
  id: number;
  name: string;
  email: string;
  bio: boolean;
  avatar: boolean;
  createdAt: Date;
  updatedAt: Date;
}>;

// 로그인
export type RequestSigninDto = {
  email: string;
  password: string;
};

export type ResponseSigninDto = CommonRespnse<{
  email: string;
  name: string;
  accessToken: string;
  refreshToken: string;
}>;

export type ResponseMyInfoDto = CommonRespnse<{
  id: number;
  name: string;
  email: string;
  bio: boolean;
  avatar: boolean | null;
  createdAt: Date;
  updatedAt: Date;
}>;
