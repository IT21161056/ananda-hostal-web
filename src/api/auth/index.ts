import { ApiError } from "../hooks/types";
import usePostRequest from "../hooks/usePostRequest";
import {
  CreateUserBody,
  LoginCredentials,
  LoginResponse,
  RefreshTokenResponse,
} from "./types";
import axiosInstance from "../../lib/axiosInstance";

export type TUseSignup = {
  onSuccess: () => void;
  onError: (error: ApiError) => void;
};
export const useSignup = ({ onSuccess, onError }: TUseSignup) =>
  usePostRequest<CreateUserBody>("/users", { onSuccess, onError });

// Login function
export const login = async (
  credentials: LoginCredentials
): Promise<LoginResponse> => {
  const response = await axiosInstance.post<LoginResponse>(
    "/auth/login",
    credentials
  );
  return response.data;
};

// Logout function
export const logout = async (): Promise<void> => {
  await axiosInstance.post("/auth/logout");
};

// Refresh token function
export const refreshToken = async (): Promise<RefreshTokenResponse> => {
  const response = await axiosInstance.get<RefreshTokenResponse>(
    "/auth/refresh"
  );
  return response.data;
};
