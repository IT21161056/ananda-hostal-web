import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
} from "@tanstack/react-query";

import type { ApiError } from "./types";
import axiosInstance from "../../lib/axiosInstance";

type MutationFn<TRequest, TResponse> = (data: TRequest) => Promise<TResponse>;

const usePostRequest = <TRequest = unknown, TResponse = unknown>(
  url: string,
  options?: UseMutationOptions<TResponse, ApiError, TRequest>
): UseMutationResult<TResponse, ApiError, TRequest> => {
  const mutationFn: MutationFn<TRequest, TResponse> = (data) => {
    // Check if data is FormData and set appropriate headers
    const config =
      data instanceof FormData
        ? {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        : {};

    return axiosInstance.post(url, data, config).then((res) => res.data);
  };

  return useMutation<TResponse, ApiError, TRequest>({ ...options, mutationFn });
};

export default usePostRequest;
