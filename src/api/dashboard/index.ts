import useGetRequest from "../hooks/useGetRequest";

export interface DashboardStats {
  totalStudents: number;
  presentToday: number;
  pendingPayments: number;
  overduePayments: number;
  monthlyRevenue: number;
  hostelOccupancy: Record<string, number>;
  attendanceRate: number;
  studentsThisMonth: number;
  avgOccupancy: number;
  totalOccupiedBeds: number;
  totalAvailableBeds: number;
  highOccupancyCount: number;
  weeklyAttendance: Array<{
    day: string;
    morning: number;
    evening: number;
  }>;
  avgMorning: number;
  avgEvening: number;
  bestDay: string;
}

export interface DashboardStatsResponse {
  success: boolean;
  data: DashboardStats;
}

export const useGetDashboardStats = () =>
  useGetRequest<DashboardStatsResponse>("/dashboard/stats");
