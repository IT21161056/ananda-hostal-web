import useGetRequest from "../hooks/useGetRequest";
import usePostRequest from "../hooks/usePostRequest";
import {
  CreateStudentBody,
  GetAllStudentsPaginated,
  TUseCreateUser,
} from "./types";

export const useCreateStudent = ({ onSuccess, onError }: TUseCreateUser) =>
  usePostRequest<CreateStudentBody>(`/student`, { onSuccess, onError });

export const useGetAllStudents = (params?: Record<string, any>) =>
  useGetRequest<GetAllStudentsPaginated>(`/student`, params);
// Add to your existing types
export type AttendanceStudent = {
  id: string;
  name: string;
  dorm: string;
  admissionNumber?: number;
};

export type AttendanceStudentsResponse = {
  count: number;
  data: AttendanceStudent[];
};
export const useGetStudentsForAttendance = (params?: Record<string, any>) =>
  useGetRequest<AttendanceStudentsResponse>(
    `/student/attendance/marking`,
    params
  );
