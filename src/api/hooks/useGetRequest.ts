import {
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from "@tanstack/react-query";
import { QueryClient } from "@tanstack/react-query";
import { ApiError } from "./types";
import axiosInstance from "../../lib/axiosInstance";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0, // Always refetch
    },
  },
});

const useGetRequest = <
  TQueryFnData = unknown,
  TError = ApiError,
  TResponse = TQueryFnData
>(
  url: string,
  params?: Record<string, any>,
  options?: Omit<
    UseQueryOptions<TQueryFnData, TError, TResponse>,
    "queryFn" | "queryKey"
  >
): UseQueryResult<TResponse, TError> => {
  return useQuery<TQueryFnData, TError, TResponse>({
    queryKey: [url, params],
    queryFn: async () => {
      const response = await axiosInstance.get<TQueryFnData>(url, { params });
      return response.data;
    },
    ...options,
  });
};

export default useGetRequest;
