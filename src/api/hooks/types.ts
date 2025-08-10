import { AxiosError } from "axios";

type ApiErrorResponse = {
  Title: string;
  Status: number;
  Detail: string;
};

export type ApiError = AxiosError<ApiErrorResponse>;
