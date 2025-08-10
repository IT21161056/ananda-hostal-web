import {
  useMutation,
  type UseMutationOptions,
  type UseMutationResult,
} from "@tanstack/react-query";
import { ApiError } from "./types";
import axiosInstance from "../../lib/axiosInstance";

type MutationFn<TRequest, TResponse> = (data: TRequest) => Promise<TResponse>;

const usePatchRequest = <TRequest = unknown, TResponse = unknown>(
  url: string,
  options?: UseMutationOptions<TResponse, ApiError, TRequest>
): UseMutationResult<TResponse, ApiError, TRequest> => {
  const mutationFn: MutationFn<TRequest, TResponse> = (data) =>
    axiosInstance.patch(url, data).then((res) => res.data);

  return useMutation<TResponse, ApiError, TRequest>({ ...options, mutationFn });
};

export default usePatchRequest;
