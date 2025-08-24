import React from "react";
import { Users, UserCheck, AlertTriangle, DollarSign } from "lucide-react";
import StatsCard from "../components/Dashboard/StatsCard";
import DormOccupancy from "../components/Dashboard/DormOccupancy";
import AttendanceChart from "../components/Dashboard/AttendanceChart";
import { mockDashboardStats } from "../data/mockData";

export default function Dashboard() {
  const stats = mockDashboardStats;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Students"
          value={stats.totalStudents}
          icon={Users}
          change="+12 this month"
          changeType="positive"
          color="blue"
        />
        <StatsCard
          title="Present Today"
          value={stats.presentToday}
          icon={UserCheck}
          change={`${Math.round(
            (stats.presentToday / stats.totalStudents) * 100
          )}% attendance`}
          changeType="positive"
          color="green"
        />
        <StatsCard
          title="Pending Payments"
          value={stats.pendingPayments}
          icon={AlertTriangle}
          change="3 overdue"
          changeType="negative"
          color="red"
        />
        <StatsCard
          title="Monthly Revenue"
          value={`Rs${(stats.monthlyRevenue / 1000000).toFixed(1)}M`}
          icon={DollarSign}
          change="+8.2% from last month"
          changeType="positive"
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AttendanceChart />
        <DormOccupancy />
      </div>
    </div>
  );
}
