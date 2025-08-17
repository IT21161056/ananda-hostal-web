import useGetRequest from "../hooks/useGetRequest";
import usePostRequest from "../hooks/usePostRequest";
import {
  CreateAttendanceSessionRequest,
  GetAttendanceSessionsPaginated,
  TUseCreateAttendance,
} from "./type";

export const useCreateAttendance = ({
  onSuccess,
  onError,
}: TUseCreateAttendance) =>
  usePostRequest<CreateAttendanceSessionRequest>(`/attendance`, {
    onSuccess,
    onError,
  });

export const useGetAttendanceHistory = (params?: Record<string, any>) =>
  useGetRequest<GetAttendanceSessionsPaginated>(`/attendance`, params, {
    refetchOnWindowFocus: true,
  });
