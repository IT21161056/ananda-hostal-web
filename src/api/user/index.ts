import useGetRequest from "../hooks/useGetRequest";
import { GetAllUsersPaginated } from "./types";

export const useGetAllUsers = (params?: Record<string, any>) =>
  useGetRequest<GetAllUsersPaginated>(`/users`, params);
