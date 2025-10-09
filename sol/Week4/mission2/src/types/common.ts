export type CommonRespnse<T> = {
  status: boolean;
  statusCode: number;
  message: string;
  data: T;
};
