import {
  useMutation,
  type UseMutationOptions,
  type UseMutationResult,
} from "@tanstack/react-query";
import { ApiError } from "./types";
import axiosInstance from "../../lib/axiosInstance";

type MutationFn<TRequest, TResponse> = (data: TRequest) => Promise<TResponse>;

type UrlOrFn<TRequest> = string | ((data: TRequest) => string);

const usePutRequest = <TRequest = unknown, TResponse = unknown>(
  urlOrFn: UrlOrFn<TRequest>,
  options?: UseMutationOptions<TResponse, ApiError, TRequest>
): UseMutationResult<TResponse, ApiError, TRequest> => {
  const mutationFn: MutationFn<TRequest, TResponse> = (data) => {
    const config =
      data instanceof FormData
        ? {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        : {};
    const url = typeof urlOrFn === "function" ? urlOrFn(data) : urlOrFn;
    return axiosInstance.put(url, data, config).then((res) => res.data);
  };

  return useMutation<TResponse, ApiError, TRequest>({ ...options, mutationFn });
};

export default usePutRequest;
