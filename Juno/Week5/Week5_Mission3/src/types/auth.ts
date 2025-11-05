import type { commonResponse } from "./common";

// 회원가입

export type RequestSignupDto = {
  name: string;
  email: string;
  bio?: string; // 필수 아님
  avatar?: string; // 필수 아님
  password: string;
};

export type ResponseSignupDto = commonResponse<{
  id: number;
  name: string;
  email: string;
  bio: string | null;
  avatar: string | null;
  createdAt: string;
  updatedAt: string;
}>;

// 로그인

export type RequestSigninDto = {
  email: string;
  password: string;
};

export type ResponseSigninDto = commonResponse<{
  id: number;
  name: string;
  accessToken: string;
  refreshToken: string;
}>;
