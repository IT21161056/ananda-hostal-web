import { ApiError } from "../hooks/types";

export type TUseCreateAttendance = {
  onSuccess: () => void;
  onError: (error: ApiError) => void;
};

export interface StudentRecord {
  student: string; // Student ID
  status: "present" | "absent";
  remarks?: string;
}

export interface CreateAttendanceSessionRequest {
  sessionType: "morning" | "evening";
  notes?: string;
  records: StudentRecord[];
}

export interface AttendanceSession {
  id: string;
  date: string;
  session: "morning" | "evening";
  presentCount: number;
  absentCount: number;
  leaveCount: number;
  totalStudents: number;
  recordedBy: string;
}

export type GetAttendanceSessionsPaginated = {
  total: number;
  data: AttendanceSession[];
};
