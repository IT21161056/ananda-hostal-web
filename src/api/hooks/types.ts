import { AxiosError } from "axios";

type ApiErrorResponse = {
  success: boolean;
  message: string;
};

export type ApiError = AxiosError<ApiErrorResponse>;
