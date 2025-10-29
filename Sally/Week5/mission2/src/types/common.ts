export type CommonResponse<T> = {
  accessToken(accessToken: string, accessToken1: any): unknown;
  status: boolean;
  statusCode: number;
  message: string;
  data: T;
};
