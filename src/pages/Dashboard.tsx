import { Users, UserCheck, AlertTriangle, DollarSign } from "lucide-react";
import StatsCard from "../components/Dashboard/StatsCard";
import DormOccupancy from "../components/Dashboard/DormOccupancy";
import AttendanceChart from "../components/Dashboard/AttendanceChart";
import { useGetDashboardStats } from "../api/dashboard";

export default function Dashboard() {
  const { data, isLoading, error } = useGetDashboardStats();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading dashboard data...</div>
      </div>
    );
  }

  if (error || !data?.data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-600">Error loading dashboard data</div>
      </div>
    );
  }

  const stats = data.data;
  const attendancePercentage =
    stats.totalStudents > 0
      ? Math.round((stats.presentToday / stats.totalStudents) * 100)
      : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Students"
          value={stats.totalStudents}
          icon={Users}
          change={
            stats.studentsThisMonth > 0
              ? `+${stats.studentsThisMonth} this month`
              : undefined
          }
          changeType="positive"
          color="blue"
        />
        <StatsCard
          title="Present Today"
          value={stats.presentToday}
          icon={UserCheck}
          change={`${attendancePercentage}% attendance`}
          changeType="positive"
          color="green"
        />
        <StatsCard
          title="Pending Payments"
          value={stats.pendingPayments}
          icon={AlertTriangle}
          change={
            stats.overduePayments > 0
              ? `${stats.overduePayments} overdue`
              : undefined
          }
          changeType={stats.overduePayments > 0 ? "negative" : "neutral"}
          color="red"
        />
        <StatsCard
          title="Monthly Revenue"
          value={
            stats.monthlyRevenue > 0
              ? `Rs${(stats.monthlyRevenue / 1000000).toFixed(1)}M`
              : "Rs0"
          }
          icon={DollarSign}
          change={stats.monthlyRevenue > 0 ? undefined : "No data"}
          changeType="neutral"
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AttendanceChart
          attendanceData={stats.weeklyAttendance}
          avgMorning={stats.avgMorning}
          avgEvening={stats.avgEvening}
          bestDay={stats.bestDay}
          attendanceRate={stats.attendanceRate}
        />
        <DormOccupancy
          dormOccupancy={stats.hostelOccupancy}
          avgOccupancy={stats.avgOccupancy}
          totalAvailableBeds={stats.totalAvailableBeds}
          highOccupancyCount={stats.highOccupancyCount}
        />
      </div>
    </div>
  );
}
